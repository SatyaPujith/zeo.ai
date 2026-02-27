import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import EmergencyContactsManager from '@/components/EmergencyContactsManager';
import {
  User,
  Mail,
  Lock,
  Shield,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Phone
} from 'lucide-react';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState<'profile' | 'password' | 'account' | 'emergency'>('profile');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateUser({ name, email });
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Call password update API
      const response = await fetch('http://localhost:3001/api/auth/updatepassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/deleteaccount', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      logout();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zeo-surface via-background to-zeo-surface py-24 px-6 md:px-12">
      <div className="container mx-auto max-w-6xl space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          {/* Alerts */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          {/* Layout Grid */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Sidebar / Navigation Tabs */}
            <div className="flex flex-col gap-2 p-2 glass rounded-2xl w-full md:w-64 shrink-0 md:sticky md:top-28">
              <button
                onClick={() => setActiveSection('profile')}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center w-full ${activeSection === 'profile'
                  ? 'bg-gradient-to-r from-zeo-primary to-zeo-secondary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveSection('password')}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center w-full ${activeSection === 'password'
                  ? 'bg-gradient-to-r from-zeo-primary to-zeo-secondary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
              >
                <Lock className="w-4 h-4 mr-2" />
                Password
              </button>
              <button
                onClick={() => setActiveSection('account')}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center w-full ${activeSection === 'account'
                  ? 'bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20'
                  : 'text-muted-foreground hover:text-destructive hover:bg-background/50'
                  }`}
              >
                <Shield className="w-4 h-4 mr-2" />
                Account
              </button>
              <button
                onClick={() => setActiveSection('emergency')}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center w-full ${activeSection === 'emergency'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                  : 'text-muted-foreground hover:text-red-500 hover:bg-background/50'
                  }`}
              >
                <Phone className="w-4 h-4 mr-2" />
                Emergency
              </button>
            </div>

            {/* Content Area */}
            <div className="w-full space-y-8 flex-1">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <Card className="glass-strong border-border/50">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      {/* Avatar */}
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-zeo-primary to-zeo-secondary text-white">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Name */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:items-center">
                        <Label htmlFor="name" className="md:text-right font-medium text-muted-foreground">Full Name</Label>
                        <div className="relative md:col-span-3">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 bg-background/50 border-border/50 text-foreground focus:border-zeo-primary h-12 rounded-xl transition-all"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:items-center">
                        <Label htmlFor="email" className="md:text-right font-medium text-muted-foreground">Email Address</Label>
                        <div className="relative md:col-span-3">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 bg-background/50 border-border/50 text-foreground focus:border-zeo-primary h-12 rounded-xl transition-all"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {/* Subscription Info */}
                      <div className="p-5 rounded-xl glass border border-border/50 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">Subscription Plan</span>
                          <span className="text-sm font-semibold capitalize px-3 py-1 bg-zeo-primary/10 text-zeo-primary rounded-full">{user?.subscription.plan || 'Free'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">Sessions Used</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-zeo-primary to-zeo-secondary"
                                style={{ width: `${((user?.subscription.sessionsUsed || 0) / (user?.subscription.sessionsLimit || 10)) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-foreground font-medium">
                              {user?.subscription.sessionsUsed || 0} / {user?.subscription.sessionsLimit || 10}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="hero"
                        className="w-full h-12 text-md"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Password Section */}
              {activeSection === 'password' && (
                <Card className="glass-strong border-white/10">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:items-center">
                        <Label htmlFor="currentPassword" className="md:text-right font-medium text-muted-foreground">Current Password</Label>
                        <div className="relative md:col-span-3">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="pl-10 bg-background/50 border-border/50 text-foreground focus:border-zeo-primary h-12 rounded-xl transition-all"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:items-baseline">
                        <Label htmlFor="newPassword" className="md:text-right font-medium text-muted-foreground pt-3">New Password</Label>
                        <div className="md:col-span-3">
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="newPassword"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="pl-10 bg-background/50 border-border/50 text-foreground focus:border-zeo-primary h-12 rounded-xl transition-all"
                              required
                              minLength={6}
                              disabled={loading}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Must be at least 6 characters</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:items-center">
                        <Label htmlFor="confirmPassword" className="md:text-right font-medium text-muted-foreground leading-tight">Confirm Password</Label>
                        <div className="relative md:col-span-3">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 bg-background/50 border-border/50 text-foreground focus:border-zeo-primary h-12 rounded-xl transition-all"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="hero"
                        className="w-full h-12 text-md"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Account Section */}
              {activeSection === 'account' && (
                <Card className="glass-strong border-border/50">
                  <CardHeader>
                    <CardTitle>Account Management</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Account Info */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Account Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">User ID</span>
                          <span className="font-mono">{user?.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Created</span>
                          <span>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Login</span>
                          <span>
                            {user?.lastLogin
                              ? new Date(user.lastLogin).toLocaleDateString()
                              : 'Never'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Status</span>
                          <span className="text-green-600 font-medium">Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-6 border-t border-border">
                      <h3 className="font-medium text-destructive mb-4">Danger Zone</h3>
                      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5">
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground">Delete Account</p>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            className="mt-4 shadow-lg shadow-destructive/20"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>

        {/* Emergency Section */}
        {activeSection === 'emergency' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-4 md:p-8 max-w-3xl mx-auto"
          >
            <EmergencyContactsManager
              contacts={user?.emergencyContacts || []}
              onUpdate={async (contacts) => {
                await updateUser({ emergencyContacts: contacts });
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
