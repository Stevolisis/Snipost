"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Trash2, Plus, Upload } from "lucide-react";

export default function CompanyProfileForm() {
  const [founders, setFounders] = useState([{ email: "" }]);
  const [socialLinks, setSocialLinks] = useState([
    { platform: "twitter", url: "" },
  ]);
  const [preview, setPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    website: "",
    size: "",
    about: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  const handleAddFounder = () => setFounders([...founders, { email: "" }]);
  const handleRemoveFounder = (index) =>
    setFounders(founders.filter((_, i) => i !== index));
  const handleFounderChange = (index, value) => {
    const updated = [...founders];
    updated[index].email = value;
    setFounders(updated);
  };

  const handleAddSocial = () =>
    setSocialLinks([...socialLinks, { platform: "twitter", url: "" }]);
  const handleRemoveSocial = (index) =>
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  const handleSocialChange = (index, key, value) => {
    const updated = [...socialLinks];
    updated[index][key] = value;
    setSocialLinks(updated);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoRemove = () => {
    setPreview(null);
    setLogoFile(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("username", formData.username);
      payload.append("email", formData.email);
      payload.append("website", formData.website);
      payload.append("size", formData.size);
      payload.append("about", formData.about);
      payload.append("location", formData.location);

      founders.forEach((f, i) => payload.append(`founders[${i}]`, f.email));
      socialLinks.forEach((s, i) => {
        payload.append(`socialLinks[${i}][platform]`, s.platform);
        payload.append(`socialLinks[${i}][url]`, s.url);
      });

      if (logoFile) payload.append("logo", logoFile);
      console.log(formData);
      console.log(founders);
      console.log(socialLinks);
      console.log(payload);

      const res = await fetch("/verify-company-email", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
    //   if (data.success) {
    //     alert("Profile submitted successfully! Awaiting verification.");
    //   } else {
    //     alert(data.message || "Error submitting profile");
    //   }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Image src="/logo2.svg" alt="Snipost logo" width={18} height={18} />
          </div>
          Snipost DevOrg.
        </a>

        <Card>
          <CardHeader className="text-center mt-8 sm:mt-12">
            <CardTitle className="text-2xl sm:text-3xl">
              About your company
            </CardTitle>
            <CardDescription>
              Fill in your company details for verification and authenticity.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <FieldGroup>
                {/* Logo Upload */}
                <div className="flex items-center gap-4">
                  {preview ? (
                    <div className="relative">
                      <Image
                        src={preview}
                        alt="Logo"
                        width={112}
                        height={112}
                        className="rounded-full object-cover border border-border min-w-28 min-h-28"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -bottom-2 right-0 w-8 h-8 rounded-full"
                        onClick={handleLogoRemove}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-w-28 min-h-28 rounded-full border border-dashed text-muted-foreground text-sm">
                      <Upload className="w-5 h-5 mb-1" />
                      Upload Logo
                    </div>
                  )}
                  <Input type="file" accept="image/*" onChange={handleLogoChange} />
                </div>

                {/* Name + Username */}
                <Field>
                  <FieldLabel>Company Name</FieldLabel>
                  <Input
                    name="name"
                    placeholder="e.g. Solana Labs"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Field>

                <Field>
                  <FieldLabel>Username</FieldLabel>
                  <Input
                    name="username"
                    placeholder="solanalabs"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                  <FieldDescription>
                    Auto-generated from company name.
                  </FieldDescription>
                </Field>

                {/* Email + Website */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      name="email"
                      placeholder="company@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Website</FieldLabel>
                    <Input
                      name="website"
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </Field>
                </div>

                {/* Company Size */}
                <Field>
                  <FieldLabel>Company Size</FieldLabel>
                  <Select
                    onValueChange={(val) =>
                      setFormData({ ...formData, size: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={formData.size || "Select size"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1–10 employees</SelectItem>
                      <SelectItem value="11-50">11–50 employees</SelectItem>
                      <SelectItem value="51-200">51–200 employees</SelectItem>
                      <SelectItem value="201-500">201–500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                {/* Social Links */}
                <Field>
                  <FieldLabel>Social Links</FieldLabel>
                  <FieldDescription>
                    Add your company’s verified social profiles.
                  </FieldDescription>

                  <div className="space-y-3 mt-2">
                    {socialLinks.map((social, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-start sm:items-center"
                      >
                        <Select
                          value={social.platform}
                          onValueChange={(val) =>
                            handleSocialChange(index, "platform", val)
                          }
                        >
                          <SelectTrigger className="flex-1 sm:w-40 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="github">GitHub</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="website">Website</SelectItem>
                          </SelectContent>
                        </Select>

                        <Input
                          className="flex-3"
                          placeholder="https://example.com"
                          value={social.url}
                          onChange={(e) =>
                            handleSocialChange(index, "url", e.target.value)
                          }
                        />

                        {socialLinks.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveSocial(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddSocial}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Social Link
                    </Button>
                  </div>
                </Field>

                {/* About */}
                <Field>
                  <FieldLabel>About Company</FieldLabel>
                  <Textarea
                    name="about"
                    placeholder="Describe what your company does..."
                    className="min-h-[100px]"
                    value={formData.about}
                    onChange={handleInputChange}
                  />
                </Field>

                {/* Location */}
                <Field>
                  <FieldLabel>Location</FieldLabel>
                  <Input
                    name="location"
                    placeholder="e.g. Lagos, Nigeria"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </Field>

                {/* Founders */}
                <Field>
                  <FieldLabel>Founder(s) Email</FieldLabel>
                  <FieldDescription>
                    Each founder’s email must be verified.
                  </FieldDescription>

                  <div className="space-y-3 mt-2">
                    {founders.map((founder, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          type="email"
                          placeholder="founder@example.com"
                          value={founder.email}
                          onChange={(e) =>
                            handleFounderChange(index, e.target.value)
                          }
                        />
                        {founders.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveFounder(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddFounder}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Founder
                    </Button>
                  </div>
                </Field>

                {/* Submit */}
                <Field>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading
                      ? "Submitting..."
                      : "Submit for Verification"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
