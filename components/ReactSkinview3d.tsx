import { useEffect, useRef } from "react";
import { SkinViewer, SkinViewerOptions } from "skinview3d";

interface ReactSkinview3dProps {
    className?: string;
    width: number | string;
    height: number | string;
    skinUrl: string;
    capeUrl?: string;
    onReady?: (args: { viewer: SkinViewer; canvasRef: HTMLCanvasElement }) => void;
    options?: SkinViewerOptions;
}

export const ReactSkinview3d = ({ className, width, height, skinUrl, capeUrl, onReady, options }: ReactSkinview3dProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const skinviewRef = useRef<SkinViewer | null>(null);

    useEffect(() => {
        if (skinviewRef.current || !canvasRef.current) return;

        const viewer = new SkinViewer({
            canvas: canvasRef.current,
            width: Number(width),
            height: Number(height),
            ...options
        });

        if (skinUrl) viewer.loadSkin(skinUrl);
        if (capeUrl) viewer.loadCape(capeUrl);

        skinviewRef.current = viewer;

        if (onReady && canvasRef.current) {
            onReady({
                viewer: skinviewRef.current,
                canvasRef: canvasRef.current
            });
        }
    }, [options]); // Run once on mount basically, dependencies simplified to avoid loop

    useEffect(() => {
        if (!skinviewRef.current) return;
        skinUrl ? skinviewRef.current.loadSkin(skinUrl) : skinviewRef.current.resetSkin();
    }, [skinUrl]);

    useEffect(() => {
        if (!skinviewRef.current) return;
        capeUrl ? skinviewRef.current.loadCape(capeUrl) : skinviewRef.current.resetCape();
    }, [capeUrl]);

    useEffect(() => {
        if (!skinviewRef.current) return;
        skinviewRef.current.setSize(Number(width), Number(height));
    }, [width, height]);

    return (
        <canvas
            className={className}
            ref={canvasRef}
        />
    );
};
