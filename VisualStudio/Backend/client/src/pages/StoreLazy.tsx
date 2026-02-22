import React, { Suspense } from 'react';
const Store = React.lazy(() => import('./Store'));
export default function StoreLazy(){
  return (<Suspense fallback={<div>Loading Store…</div>}><Store/></Suspense>);
}
