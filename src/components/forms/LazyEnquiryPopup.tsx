'use client';

/**
 * The enquiry popup, loaded on its own after the page: it opens a moment after load anyway, so
 * its code (the form, the scene) need not hold up the first paint or hydration.
 */
import dynamic from 'next/dynamic';

export const LazyEnquiryPopup = dynamic(() => import('./EnquiryPopup').then((m) => m.EnquiryPopup), {
  ssr: false,
});
