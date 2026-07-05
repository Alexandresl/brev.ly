import { deleteLinkService } from "@/services/delete-link/delete-link.service.ts";
import { getLinksService } from "@/services/get-links/get-links.service.ts";
import { createLinkService } from "@/services/create-link/create-link.service.ts";
import { exportLinksCsvService } from "@/services/export-links-csv/export-links-csv.service.ts";

export const fetchLinks = getLinksService;
export const removeLink = deleteLinkService;
export const addLink = createLinkService
export const exportLinksCsv = exportLinksCsvService;
