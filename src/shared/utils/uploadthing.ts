import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/infrastructure/storage/uploadthing";

// Gera os hooks tipados para usar o Uploadthing no frontend.
// O useUploadThing é o hook principal que o VideoUploader usa.
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
