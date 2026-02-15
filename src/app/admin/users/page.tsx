import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserActionsMenu } from "./user-actions-menu";

export const metadata = { title: "Daftar Pengguna | Admin" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { bookmarks: true },
      },
    },
  });

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Kelola Pengguna</h1>
          <p className="text-slate-500 text-sm mt-1">Daftar semua akun yang terdaftar di MuzLib.</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1 bg-white">
          {users.length} User
        </Badge>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Koleksi</th>
                <th className="px-6 py-4 text-right">Tanggal Bergabung</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                          {user.email.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{user.email}</span>
                        <span className="text-xs text-slate-400">ID: {user.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === "ADMIN" ? (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">ADMIN</Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-500">USER</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium">{user._count.bookmarks}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <UserActionsMenu userId={user.id} currentRole={user.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}