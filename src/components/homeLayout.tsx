import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import EmblaCarousel from './myui/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel';
import ReviewLayout from './review-layout';
import FooterLayout from './footerLayout';
import { Turret_Road } from "next/font/google";

const troad = Turret_Road({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin', 'latin-ext']
});

const OPTIONS: EmblaOptionsType = { loop: true };
const SLIDES = Array.from(Array(4).keys());

function HomeLayout() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col-reverse gap-4 lg:flex-row items-center mt-14 px-6 lg:px-12">
        {/* Intro Text */}
        <div className={`flex flex-col gap-4 w-full lg:w-1/2 mt-6 lg:mt-0`}>
          <p className={`text-3xl sm:text-4xl lg:text-5xl font-semibold ${troad.className}`}>Your Personal Study Planner, Reinvented</p>
          <p className="text-lg lg:text-xl">Welcome to <strong>FocusMate</strong> — your smart study companion.</p>
          <p className="text-sm lg:text-base text-muted-foreground">
            Whether you&apos;re preparing for exams, managing class deadlines, or just trying to stay productive, FocusMate helps you create personalized study plans, track progress, and stay focused using AI-powered insights and reminders.
          </p>
          <Link href="/auth/signup">
            <Button className="px-6 py-6 border-gray-500 border-2 mt-3 w-fit cursor-pointer text-xl">Create Study Plan</Button>
          </Link>
        </div>

        {/* Carousel */}
        <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
          <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-20 px-4 flex flex-col items-center text-center">
        <p className="text-2xl sm:text-3xl font-medium mb-5">Testimonials</p>
        <ReviewLayout />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 mx-4 mt-10 pt-6">
        <FooterLayout />
      </div>
    </div>
  );
}

export default HomeLayout;
