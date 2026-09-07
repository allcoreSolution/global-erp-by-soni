import React from 'react';
import { QuickLinks, SummaryCards } from '../components/DashboardContent1';
import { DashboardCharts } from '../components/DashboardCharts';
import { DashboardTables } from '../components/DashboardTables';
import { IndustrySolutions, HelpAndSupport } from '../components/DashboardFooter';

const Dashboard = () => {
  return (
    <>
      <QuickLinks />
      <SummaryCards />
      <DashboardCharts />
      <DashboardTables />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-10 flex flex-col gap-4">
          <IndustrySolutions />
        </div>
        <div className="lg:col-span-2">
          <HelpAndSupport />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
