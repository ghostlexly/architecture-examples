import { z } from "zod";

const params = z.object({
  id: z.string(),
});

export default { params };
