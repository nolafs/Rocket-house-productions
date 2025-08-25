'use client';
import { Lesson, Module } from '@prisma/client';
import * as THREE from 'three';

export type LessonType = Lesson & { category: { name: string } };
export type ModuleSection = Module & { lessons: LessonType[] };

export type LessonButton = {
  num: number;
  id: string;
  name: string;
  slug: string;
  moduleSlug: string;
  color: string;
  type: string;
  isFree?: boolean;
};

export type ModulePosition = {
  id: string;
  name: string;
  position: THREE.Vector3;
};
