import { BrandLoader } from "@/components/protected";

export default function GlobalLoading() {
  return (
    <div className="container-x">
      <BrandLoader label="Cueing the lights…" />
    </div>
  );
}
