import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const S3_CONFIG = {
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AMAZON_S3_ACCESSKEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_AMAZON_S3_SECRET_ACCESS_KEY || "",
  },
};

const client = new S3Client(S3_CONFIG);

export const getPutCommandObject = async (key: string, body: any, ContentType: string) => {
  const prefix = new Date().toISOString().split("T")[0];
  const newKey = prefix + key.split("/").pop();
  console.log(newKey);

  const command = new PutObjectCommand({
    Bucket: "gachi-myeonjeob",
    Key: newKey,
    Body: body,
    ACL: "public-read",
    ContentType: ContentType,
  });

  try {
    const response = await client.send(command);
    const url = `https://gachi-myeonjeob.s3.ap-northeast-2.amazonaws.com/${newKey}`;

    return url;
  } catch (err) {
    console.error(err);
  }
};
