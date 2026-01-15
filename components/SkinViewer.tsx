'use client';

import React from 'react';
import { ReactSkinview3d } from 'react-skinview3d';

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
                // Set animation to walking
                if (viewer.animations) {
                    viewer.animation = viewer.animations.run;
                    viewer.animation.speed = 0.5;
                }
            }}
            options={{
                zoom: 0.9,
                fov: 70
            }}
        />
    );
}
