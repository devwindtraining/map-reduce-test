'use client';

import dynamic from 'next/dynamic';

export default function Page() {
	return <MyApp />;
}

const MyApp = dynamic(() => import('./components/MyApp'), {
	ssr: false
});
