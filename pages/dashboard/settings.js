import React from 'react';
import Head from 'next/head';
import { withAuth } from '../../middleware/withAuth';
import { DashboardSidebar, SettingsForm } from '../../components/dashboard';

function SettingsPage() {
  return (
    <>
      <Head>
        <title>Настройки | RoomGenius AI</title>
      </Head>

      <div className="min-h-screen bg-black flex">
        <DashboardSidebar className="hidden lg:flex" />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-8">Настройки</h1>
            <SettingsForm />
          </div>
        </main>
      </div>
    </>
  );
}

export default withAuth(SettingsPage, { requireAuth: true });
