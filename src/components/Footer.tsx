import WireMeshTrigger from "@/components/EasterEgg/WireMeshTrigger";

export default function Footer({
  maxWidth = "1160px",
  paddingY = "60px",
}: {
  maxWidth?: string;
  paddingY?: string;
}) {
  return (
    <div id="contact" className="border-t border-border">
      <div
        className="mx-auto flex items-center justify-between px-14"
        style={{ maxWidth, paddingTop: paddingY, paddingBottom: paddingY }}
      >
        <div className="text-[16px] text-ink">Colin Roberts</div>
        <div className="flex items-center gap-4">
          <WireMeshTrigger />
          <div className="text-[11px] tracking-[2px] uppercase text-muted">&copy; 2026</div>
        </div>
      </div>
    </div>
  );
}
