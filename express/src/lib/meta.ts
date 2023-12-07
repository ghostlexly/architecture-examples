/**
 * @author GhostLexly <ghostlexly@gmail.com>
 */

import { Request, Response } from "express";
import merge from "lodash/merge";
import { Prisma } from "@prisma/client";
import { prisma } from "../providers/database/prisma";
import { logger } from "./logger";
import createHttpError from "http-errors";

// type ModelDelegates = {
//   [K in Prisma.ModelName]: PrismaClient[Uncapitalize<K>];
// };

type HandleMetaProps<T extends Prisma.ModelName> = {
  model: T;
  req: Request;
  args?: Prisma.Args<(typeof prisma)[Uncapitalize<T>], "findMany">;
};

/**
 * Inject and export metas in one function.
 * Example of URL: /api/users?include=posts&order=createdAt:desc&limit=10&page=1
 * @param model - The entity to query.
 * @param req - The request object.
 * @param args - The find() options to pass to the query. Do not add [take] and [limit] options.
 */
const handleMeta = async <T extends Prisma.ModelName>({
  model,
  req,
  args,
}: HandleMetaProps<T>) => {
  try {
    // get find args from request
    const meta = injectMeta({ req });

    // merge meta (find queries from request) with args (find queries from controller)
    const mergedArgs = merge({}, args, meta);

    // get data and count from the database
    const [data, count] = await prisma[
      model as Prisma.ModelName
    ].findManyAndCount({
      ...mergedArgs,
    });

    // export data and meta to the response
    return exportMeta({ data, req, totalItems: count, limit: meta.take });
  } catch (ex) {
    logger.error(ex.stack);
    throw createHttpError(
      400,
      "Une erreur est survenue lors de la pagination des données."
    );
  }
};

type InjectMetaProps = {
  req: Request;
  paginate?: boolean;
  sort?: boolean;
};

type InjectMetaResponse = {
  skip: number;
  take: number;
  include: any;
  orderBy: any;
};

/**
 * Inject metas to the SQL query.
 * @param param0
 * @returns
 */
const injectMeta = ({
  req,
  paginate = true,
  sort = true,
}: InjectMetaProps): InjectMetaResponse => {
  const { skip, take } = handlePagination(req);
  const { orderBy } = handleSorting({ req });
  const include = handleIncludes(req);

  return {
    skip,
    take,
    include: Object.values(include).length > 0 ? include : null,
    orderBy,
  };
};

type ExportMetaProps = {
  req: Request;
  data: any[];
  totalItems: number;
  limit: number;
};

/**
 * Export metas to the response.
 * @param param0
 * @returns
 */
const exportMeta = ({
  req,
  data,
  totalItems,
  limit,
}: ExportMetaProps): {
  items: any[];
  meta: { totalItems: number; limit: number };
} => {
  return {
    items: data,
    meta: {
      totalItems,
      limit,
    },
  };
};

/**
 * Handle pagination from the request.
 * @param req
 * @returns
 */
const handlePagination = (req: Request): { skip: number; take: number } => {
  let { page, limit }: { page?: number; limit?: number } = req.query;

  let skip: number = 0;
  let take: number = 25;

  // define limit
  if (!limit || limit > 1000) {
    limit = 25;
  }

  // define page
  if (!page || page < 1) {
    page = 1;
  }

  skip = (+page - 1) * +limit;
  take = +limit;

  return {
    skip,
    take,
  };
};

type HandleSortingProps = {
  req: Request;
};

type HandleSortingResponse = {
  orderBy: { [key: string]: "asc" | "desc" };
};

/**
 * Handle sorting from the request.
 *
 */
const handleSorting = ({ req }: HandleSortingProps): HandleSortingResponse => {
  const { order } = req.query;

  if (order) {
    const [column, direction] = order.toString().split(":");

    return {
      orderBy: {
        [column]: direction.toLowerCase() as "asc" | "desc",
      },
    };
  }

  return { orderBy: {} };
};

/**
 * Handle includes/relations from the request.
 * @param req
 * @returns
 */
const handleIncludes = (req: Request) => {
  const { include }: { include?: string } = req.query;

  // if include query is not empty
  if (include) {
    // -- if include query contains comma for multiple relations
    if (include.includes(",")) {
      // split query includes by comma
      const splitedRelations = include.split(",");

      // create output object with each relation as true
      let output = {};
      splitedRelations.map((relationName) => {
        output[relationName] = true;
      });

      return output;
    } else {
      // -- if include query contains only one relation
      return { [include]: true };
    }
  }

  return {};
};

export { handleMeta, injectMeta, exportMeta };
