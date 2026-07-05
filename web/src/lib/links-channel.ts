export const LINKS_CHANNEL_NAME = "brev-links";

export type LinksChannelMessage = {
  type: "link-accessed";
  shortUrl: string;
};
