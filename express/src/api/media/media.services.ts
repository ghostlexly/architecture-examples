import createHttpError from "http-errors";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import { UploadedFile } from "express-fileupload";
import crypto from "crypto";
import { prisma } from "../../providers/database/prisma";
import { Media } from "@prisma/client";

const storeDir = path.join(process.cwd(), "storage");

type StoreProps = {
  file: UploadedFile | UploadedFile[];
  allowedTypes: string[];
};

/**
 * Store the file in the database and in the filesystem
 */
const store = async ({ file, allowedTypes }: StoreProps) => {
  // check if files received
  if (!file) {
    throw createHttpError(400, "No file received.");
  }

  // check if it's only one file
  if (Array.isArray(file)) {
    throw createHttpError(400, "You can only send one file at a time.");
  }

  // check file type
  if (!allowedTypes.includes(file.mimetype)) {
    throw createHttpError(400, "This file type is not allowed.");
  }

  // Constants
  const uploadDir = path.join(
    storeDir,
    dayjs().format("YYYY"),
    dayjs().format("MM"),
    dayjs().format("DD")
  );
  const normalizedFileName = normalizeFilename(file.name);

  // Create uploads folder if it doesn't exist
  if (fs.existsSync(uploadDir) === false) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Copy the file to the store directory
  file.mv(path.join(uploadDir, normalizedFileName), (err) => {
    if (err) {
      throw createHttpError(400, err);
    }
  });

  // Write to the database
  const media = await prisma.media.create({
    data: {
      filename: normalizedFileName,
      mimetype: file.mimetype,
      size: file.size,
      path: path.join(uploadDir, normalizedFileName),
    },
  });

  return media;
};

type DestroyProps = {
  media: Media;
};

/**
 * Remove the file from the database and from the filesystem
 */
const destroy = async ({ media }: DestroyProps) => {
  // Remove the file from the filesystem
  fs.unlinkSync(media.path);

  // Remove the file from the database
  await prisma.media.delete({
    where: {
      id: media.id,
    },
  });
};

type GetMetaInformationsProps = {
  media: Media;
};

/**
 * Get the meta informations of the file
 */
const getMetaInformations = ({ media }: GetMetaInformationsProps) => {
  return {
    relativeUrl: getMediaRelativeUrl({
      media: media,
    }),
    filename: media.filename,
  };
};

type GetMediaPublicUrlProps = {
  media: Media;
};
const getMediaAbsoluteUrl = ({ media }: GetMediaPublicUrlProps) => {
  return `https://nginx/api/media/${media.id}`;
};

const getMediaRelativeUrl = ({ media }: GetMediaPublicUrlProps) => {
  return `/api/media/${media.id}`;
};

const normalizeFilename = (filename: string, appendRandom: boolean = true) => {
  // Remove special characters using path.normalize()
  const normalized = path.normalize(filename);

  // Add random number before the file extension
  const extension = path.extname(normalized);
  const baseName = path.basename(normalized, extension);
  const random = crypto.randomBytes(4).toString("hex");
  let finalName: string;

  if (appendRandom) {
    finalName = `${baseName}-${random}${extension}`;
  } else {
    finalName = `${baseName}${extension}`;
  }

  // Remove whitespace and other characters using a regular expression
  const cleaned = finalName.replace(/[^a-zA-Z0-9.]+/g, "_");

  // Join directory and normalized filename components back together
  const normalizedFilename = path.join(path.dirname(normalized), cleaned);

  return normalizedFilename;
};

export default {
  store,
  normalizeFilename,
  destroy,
  getMediaAbsoluteUrl,
  getMediaRelativeUrl,
  getMetaInformations,
};
