// @/components/bpl/crn-tracking-section.tsx
'use client';

import { ListChecks } from 'lucide-react';
import { CrnTrackingCard, type CrnStatus } from './crn-tracking-card';
import { DashboardTitleBlock } from './dashboard-title-block';

// Dummy data for CRN cards
const crnData = [
  {
    crnId: "CRN00123", status: "Green" as CrnStatus, customerName: "Mr. Ankit Patel", spmName: "Ravi Kumar", stage: "Flooring & Tiling",
    details: [ { label: "Planned End Date", value: "30 May 2025" }, { label: "Days Overdue", value: 0 }, { label: "Pending Tasks", value: 3 }],
    progressValue: 75,
  },
  {
    crnId: "CRN00456", status: "Amber" as CrnStatus, customerName: "Ms. Sneha Reddy", spmName: "Priya Singh", stage: "Brickwork",
    details: [ { label: "Planned End Date", value: "15 Jun 2025" }, { label: "Days Overdue", value: 5 }, { label: "Pending Tasks", value: 8 }],
    progressValue: 40,
  },
  {
    crnId: "CRN00789", status: "Red" as CrnStatus, customerName: "Mr. Vikram Rao", spmName: "Sunil Mehta", stage: "Foundation",
    details: [ { label: "Planned End Date", value: "20 May 2025" }, { label: "Days Overdue", value: 12 }, { label: "Pending Tasks", value: 15 }],
    progressValue: 15,
  },
   {
    crnId: "CRN00234", status: "Green" as CrnStatus, customerName: "Mrs. Deepa Krishnan", spmName: "Ravi Kumar", stage: "Electrical Wiring",
    details: [ { label: "Planned End Date", value: "10 Jun 2025" }, { label: "Days Overdue", value: 0 }, { label: "Pending Tasks", value: 2 }],
    progressValue: 85,
  },
];

// export function CrnTrackingSection() {
//   return (
//     <section id="project-tracker" className="mb-8">
//       <DashboardTitleBlock 
//         title="CRN Project Tracking" 
//         subtitle="Monitor the health and progress of individual construction projects."
//         icon={<ListChecks size={32} />}
//       />
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {crnData.map((crn, index) => (
//           <CrnTrackingCard
//             key={index}
//             crnId={crn.crnId}
//             status={crn.status}
//             customerName={crn.customerName}
//             spmName={crn.spmName}
//             stage={crn.stage}
//             details={crn.details}
//             progressValue={crn.progressValue}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }
