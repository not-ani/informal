import { createLoader, parseAsString } from "nuqs/server";

export const responsesFilters = {
  search: parseAsString.withDefault(""),
  field: parseAsString.withDefault("all"),
  fieldValue: parseAsString.withDefault(""),
  date: parseAsString.withDefault("all"),
};


export const responsesLoader = createLoader(responsesFilters);