import { CONSTANT } from "@/utils/constants";
import { createClient } from "@supabase/supabase-js";

const supa = createClient(
  CONSTANT.SUPABASE_URL as string,
  CONSTANT.SUPABASE_SERVICE_ROLE_KEY as string
);

export default supa