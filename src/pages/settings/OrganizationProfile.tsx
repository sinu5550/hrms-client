import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";

export default function OrganizationProfile() {
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    phone: "",
    email: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await api.get("/settings");
        if (data) {
          setFormData({
            companyName: data.companyName || "",
            address: data.address || "",
            phone: data.phone || "",
            email: data.email || "",
          });
          if (data.logoUrl) {
            setLogoPreview(data.logoUrl);
          }
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setIsFetching(false);
      }
    }
    fetchSettings();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = new FormData();
      payload.append("companyName", formData.companyName);
      payload.append("address", formData.address);
      payload.append("phone", formData.phone);
      payload.append("email", formData.email);
      if (logo) {
        payload.append("logo", logo);
      }

      await api.put("/settings", payload, { isFormData: true });
      toast.success("Settings updated successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update settings";
      toast.error(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Company Settings</h1>
        <p className="text-gray-500">Manage your organization's public profile and contact information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
          <CardDescription>
            This information will be displayed on reports, invoices, and the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Acme Corp"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Public Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@acme.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="w-full md:w-64 space-y-4">
                <Label>Company Logo</Label>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-gray-400 text-xs text-center p-2">No logo uploaded</div>
                    )}
                  </div>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => document.getElementById("logo-upload")?.click()}
                  >
                    {logoPreview ? "Change Logo" : "Upload Logo"}
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Business St, Suite 100, City, Country"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="px-8">
                {isLoading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
