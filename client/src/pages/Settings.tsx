import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import HomeLayout from '@/components/layouts/HomeLayout';
import HomeNavbar from '@/components/HomeNavbar';
import { useNavigate } from "react-router-dom";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

type SettingsTab = 'account' | 'privacy' | 'display';

export default function Settings() {
  const { userData } = useAuthStore();
  const { isDarkMode, setDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    bio: userData?.bio || "",
    isPrivate: userData?.isPrivate || false,
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username,
        email: userData.email,
        bio: userData.bio || "",
        isPrivate: userData.isPrivate || false,
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError("");
  };

  const handlePasswordUpdate = async () => {
    if (!auth.currentUser) return;
    
    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    // Validate password length
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        passwordForm.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await updatePassword(auth.currentUser, passwordForm.newPassword);
      
      // Clear form and show success
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordError("Password updated successfully!");
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        setPasswordError("Current password is incorrect");
      } else {
        setPasswordError("Failed to update password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!auth.currentUser) return;
    setLoading(true);

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        username: formData.username,
        bio: formData.bio,
        isPrivate: formData.isPrivate,
        darkMode: isDarkMode,
        updatedAt: new Date().toISOString()
      });
      // Redirect to profile page after successful update
      navigate(`/profile/${formData.username}`);
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderAccountSettings = () => (
    <div className="grid gap-6 max-w-2xl">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">Username</label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          disabled
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">Bio</label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="min-h-[100px]"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Password Change Section */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
          {passwordError && (
            <p className={`text-sm ${passwordError.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
              {passwordError}
            </p>
          )}
          <Button
            onClick={handlePasswordUpdate}
            disabled={loading}
            className="w-32"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="grid gap-6 max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-semibold">Profile Visibility</h3>
            <p className="text-sm text-gray-500">
              Choose whether your profile is public or private. When private, only your basic profile information will be visible to others.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={formData.isPrivate ? "outline" : "default"}
              onClick={() => setFormData(prev => ({ ...prev, isPrivate: false }))}
              className="w-24"
            >
              Public
            </Button>
            <Button
              variant={!formData.isPrivate ? "outline" : "default"}
              onClick={() => setFormData(prev => ({ ...prev, isPrivate: true }))}
              className="w-24"
            >
              Private
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium mb-2">What others can see when your profile is private:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Your profile picture and username</li>
            <li>• Your bio</li>
            <li>• Your join date</li>
          </ul>
          <div className="mt-4 text-sm text-gray-600">
            <p>Hidden information includes:</p>
            <ul className="space-y-2 mt-2">
              <li>• Your reading lists</li>
              <li>• Your stats (likes, dislikes, reviews)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDisplaySettings = () => (
    <div className="grid gap-6 max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-semibold text-foreground">Dark Mode</h3>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark theme for a more comfortable reading experience.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={!isDarkMode ? "default" : "outline"}
              onClick={() => setDarkMode(false)}
              className="w-24"
            >
              Light
            </Button>
            <Button
              variant={isDarkMode ? "default" : "outline"}
              onClick={() => setDarkMode(true)}
              className="w-24"
            >
              Dark
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!userData) {
    return null;
  }

  return (
    <HomeLayout>
      <HomeNavbar />
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-background to-accent/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8">
            {/* Settings Card */}
            <div className="flex flex-col gap-6 bg-card/80 backdrop-blur-sm p-10 rounded-2xl shadow-lg border border-border ring-1 ring-ring/10 w-full max-w-5xl mx-auto">
              {/* Tabs */}
              <div className="flex gap-8 border-b border-border">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`pb-4 transition-all ${
                    activeTab === 'account'
                      ? 'text-2xl font-bold text-foreground border-b-2 border-foreground'
                      : 'text-lg text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Account Settings
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`pb-4 transition-all ${
                    activeTab === 'privacy'
                      ? 'text-2xl font-bold text-foreground border-b-2 border-foreground'
                      : 'text-lg text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Privacy Settings
                </button>
                <button
                  onClick={() => setActiveTab('display')}
                  className={`pb-4 transition-all ${
                    activeTab === 'display'
                      ? 'text-2xl font-bold text-foreground border-b-2 border-foreground'
                      : 'text-lg text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Display Settings
                </button>
              </div>

              {/* Content */}
              {activeTab === 'account' ? renderAccountSettings() 
                : activeTab === 'privacy' ? renderPrivacySettings()
                : renderDisplaySettings()}
            </div>

            {/* Save Button */}
            <div className="flex justify-end max-w-5xl mx-auto w-full">
              <Button
                onClick={handleSaveChanges}
                disabled={loading}
                className="w-32"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </HomeLayout>
  );
} 