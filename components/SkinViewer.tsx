'use client';

import React from 'react';
import { ReactSkinview3d } from './ReactSkinview3d';

interface SkinViewerProps {
    skinUrl: string;
    width?: number;
    height?: number;
}

export default function SkinViewer({ skinUrl, width = 300, height = 400 }: SkinViewerProps) {
    return (
        <ReactSkinview3d
            skinUrl={skinUrl}
            height={height}
            width={width}
            onReady={({ viewer }) => {
                // Enable auto-rotate for a dynamic look
                viewer.autoRotate = true;
                viewer.autoRotateSpeed = 1;
            }}
            options={{
                zoom: 0.9,
                fov: 70
            }}
        />
    );
}
