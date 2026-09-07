import { SITE } from "@/config/site"
import pkg from "../../../../package.json"

export const VERSION: string = pkg.version
export const REPOSITORY_URL: string = SITE.social.github
export const REPOSITORY_LABEL: string = REPOSITORY_URL.replace(
  /^https?:\/\//,
  ""
)
