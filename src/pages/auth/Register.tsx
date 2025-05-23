import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/config-global";
import { useRegister } from "@/hooks/use-signup";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface Props {
  className?: string;
}

export const Register: React.FC<Props> = ({ className, ...props }) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const { mutate: register, isLoading, isError, error } = useRegister();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      firstName,
      email,
      password,
    };

    register(data, {
      onSuccess: (response) => {
        console.warn("Register successful:", response);

        const token = response.token;

        if (token) {
          login(token);
          navigate(ROUTES.HOME);
        }
      },
      onError: (error) => {
        console.error("Register failed:", error);
      },
    });
  };

  return (
    <main className={cn("", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-balance text-gray-500">
                  Create your account
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Vladyslav"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Button type="submit" className="w-full">
                {isLoading ? "Signing up..." : "Sign up"}
              </Button>
              {isError && (
                <p style={{ color: "red" }}>{(error as Error).message}</p>
              )}

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-200" />

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  to={ROUTES.AUTH.LOGIN}
                  className="underline underline-offset-4"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};
