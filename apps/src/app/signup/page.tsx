import { SignUp } from '@/components/SignUp';

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
        </div>
        <SignUp />
      </div>
    </main>
  );
} 