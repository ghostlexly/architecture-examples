import { User } from "@prisma/client";

// Create a new type that merges the existing Request type with the additional user property
type AuthenticatedRequest = Request & { user: User };

// Extend the default Request type with our custom AuthenticatedRequest
declare module "@nestjs/common" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Request extends AuthenticatedRequest {}
}
