import { motion } from 'framer-motion';
import Link from 'next/link';

import { MessageIcon, ProjectHubIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <ProjectHubIcon size={32} />
          <span>+</span>
          <MessageIcon size={32} />
        </p>
        <p>
          Welcome to Project Hub, an intelligent chatbot platform built with Next.js and the AI SDK. 
          It uses the{' '}
          <code className="rounded-md bg-muted px-1 py-0.5">streamText</code>{' '}
          function in the server and the{' '}
          <code className="rounded-md bg-muted px-1 py-0.5">useChat</code> hook
          on the client to create a seamless chat experience.
        </p>
        <p>
          Project Hub helps you manage your projects and tasks with the power of AI.
          Get started by asking a question or creating a new project.
        </p>
      </div>
    </motion.div>
  );
};
