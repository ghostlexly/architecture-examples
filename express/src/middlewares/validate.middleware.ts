import transZodFr from "@/src/locales/zod/fr.json";
import { NextFunction, Request, RequestHandler, Response } from "express";
import httpError from "http-errors";
import i18next from "i18next";
import { ZodSchema, ZodType, ZodTypeDef, z } from "zod";
import { zodI18nMap } from "zod-i18n-map";

/**
 * Initialize i18next
 */
i18next.init({
  lng: "fr",
  resources: {
    fr: { zod: transZodFr },
  },
});

z.setErrorMap(zodI18nMap);

type SchemaProps<TBody, TParams, TQuery> = {
  body?: ZodSchema<TBody>;
  params?: ZodSchema<TParams>;
  query?: ZodSchema<TQuery>;
};

type ValidateProps<TBody, TParams, TQuery> = {
  req: Request;
  schema: SchemaProps<TBody, TParams, TQuery>;
};

type ValidateResult<TBody, TParams, TQuery> = {
  body: TBody;
  params: TParams;
  query: TQuery;
};

export declare type TypedRequest<Schema extends SchemaProps<any, any, any>> =
  Request<
    Schema["params"] extends ZodSchema<infer Params> ? Params : any,
    any,
    Schema["body"] extends ZodSchema<infer Body> ? Body : any,
    Schema["query"] extends ZodSchema<infer Query> ? Query : any
  >;

const validate = async <TBody, TParams, TQuery>({
  req,
  schema,
}: ValidateProps<TBody, TParams, TQuery>): Promise<
  ValidateResult<TBody, TParams, TQuery>
> => {
  let output: { body: any; params: any; query: any } = {
    body: {},
    params: {},
    query: {},
  };

  try {
    if (schema.body) {
      output.body = await schema.body.parseAsync(req.body);
    }
  } catch (zodError) {
    throw httpError(400, {
      json: {
        message: `Le formulaire comporte ${
          Object.values(zodError.errors).length
        } erreur(s). Veuillez les corriger pour continuer.`,
        errors: zodError.errors.map((e) => ({
          code: e.code,
          message: e.message,
          path: e.path,
        })),
      },
    });
  }

  try {
    if (schema.params) {
      output.params = await schema.params.parseAsync(req.params);
    }
  } catch (zodError) {
    throw httpError(400, {
      json: {
        message: `Les params de la page comportent ${
          Object.values(zodError.errors).length
        } erreur(s). Veuillez les corriger pour continuer.`,
        errors: zodError.errors.map((e) => ({
          code: e.code,
          message: e.message,
          path: e.path,
        })),
      },
    });
  }

  try {
    if (schema.query) {
      output.query = await schema.query.parseAsync(req.query);
    }
  } catch (zodError) {
    throw httpError(400, {
      json: {
        message: `Les query de la page comportent ${
          Object.values(zodError.errors).length
        } erreur(s). Veuillez les corriger pour continuer.`,
        errors: zodError.errors.map((e) => ({
          code: e.code,
          message: e.message,
          path: e.path,
        })),
      },
    });
  }

  return output;
};

const validateSchema =
  <TBody, TParams, TQuery>(
    schema: SchemaProps<TBody, TParams, TQuery>
  ): RequestHandler<TParams, any, TBody, any> =>
  async (req: any, res: Response, next: NextFunction) => {
    const { body, params, query } = await validate({ schema, req });

    if (body) {
      req.body = body;
    }

    if (params) {
      req.params = params;
    }

    if (query) {
      req.query = query;
    }

    next();
  };

export { validateSchema, validate };
