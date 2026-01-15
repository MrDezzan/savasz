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
            onReady={(instance) => {
                // Set animation to walking
                instance.animation = instance.animations.run;
                instance.animation.speed = 0.5;
                // instance.nameTag = null; // Hide nametag if shown by default
            }}
            options={{
                zoom: 0.9,
                fov: 70,
                globalLight: { intensity: 1.5, color: 0xFFFFFF }
            }}
        />
    );
}
