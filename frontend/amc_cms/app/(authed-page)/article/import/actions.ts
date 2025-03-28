export async function parseWordPressXml(xmlString: string): Promise<any[]> {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "text/xml");

  const parseError = xml.getElementsByTagName("parsererror");
  if (parseError.length > 0) {
    throw new Error(
      "不正なXML形式です。ファイルが破損しているか、XML以外の可能性があります。"
    );
  }

  const items = Array.from(xml.getElementsByTagName("item"));
  if (items.length === 0) {
    throw new Error(
      "XML内に記事データ（<item>）が見つかりませんでした。正しいWordPressエクスポートファイルを指定してください。"
    );
  }

  const result = items.map((item) => {
    const getText = (tagName: string): string | null => {
      const el = item.getElementsByTagName(tagName);
      return el.length ? el[0].textContent : null;
    };

    const getMultipleText = (tagName: string): string[] => {
      const els = Array.from(item.getElementsByTagName(tagName));
      return els.map((el) => el.textContent || "");
    };

    return {
      title: decodeHtmlEntities(getText("title")),
      link: getText("link"),
      pubDate: getText("pubDate"),
      creator: getText("dc:creator"),
      guid: getText("guid"),
      description: getText("description"),
      encoded: getText("content:encoded"),
      post_id: Number(getText("wp:post_id")),
      post_date: getText("wp:post_date"),
      post_date_gmt: getText("wp:post_date_gmt"),
      post_modified: getText("wp:post_modified"),
      post_modified_gmt: getText("wp:post_modified_gmt"),
      comment_status: getText("wp:comment_status"),
      ping_status: getText("wp:ping_status"),
      post_name: getText("wp:post_name"),
      status: getText("wp:status"),
      post_parent: getText("wp:post_parent"),
      menu_order: getText("wp:menu_order"),
      post_type: getText("wp:post_type"),
      post_password: getText("wp:post_password"),
      is_sticky: getText("wp:is_sticky"),
      category: getMultipleText("category").map(decodeHtmlEntities),
      attachment_url: getText("wp:attachment_url"),
      postmeta: getMultipleText("wp:postmeta"),
    };
  });

  return result;
}

const decodeHtmlEntities = (text: string | null): string => {
  if (!text) return "";
  const doc = new DOMParser().parseFromString(text, "text/html");
  return doc.documentElement.textContent || "";
};
