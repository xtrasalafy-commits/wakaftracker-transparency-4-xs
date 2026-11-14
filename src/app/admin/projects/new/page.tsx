import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Tambah Proyek Wakaf Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <ProjectForm />
      </CardContent>
    </Card>
  );
}
