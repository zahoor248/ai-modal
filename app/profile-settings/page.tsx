"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { 
  User, 
  Settings, 
  Link as LinkIcon, 
  Shield, 
  Bell, 
  Palette,
  Download,
  Trash2,
  Plus,
  Check,
  X,
  ExternalLink,
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const SOCIAL_PLATFORMS = [
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#ff0050',
    description: 'Share your stories as creative videos'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    color: '#ff0000',
    description: 'Create story-based video content'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: '#e4405f',
    description: 'Visual storytelling with images and reels'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👥',
    color: '#1877f2',
    description: 'Connect with your reading community'
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    color: '#1da1f2',
    description: 'Share story snippets and quotes'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: '#0077b5',
    description: 'Professional storytelling and writing tips'
  }
];

export default function ProfileSettingsPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({});
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Load user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Load connected social accounts
      const { data: accountsData } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', user.id);
      
      if (accountsData) {
        setConnectedAccounts(accountsData);
      }

      // Load user settings
      const { data: settingsData } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (settingsData) {
        setSettings(settingsData);
      } else {
        // Default settings
        setSettings({
          notifications: {
            email: true,
            push: true,
            marketing: false
          },
          privacy: {
            profile_public: false,
            stories_public: true,
            analytics: true
          },
          content: {
            auto_publish: false,
            default_platforms: ['instagram'],
            content_approval: true
          }
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectPlatform = async (platformId: string) => {
    try {
      // In a real implementation, this would initiate OAuth flow
      // For now, we'll simulate the connection
      toast.loading('Connecting to platform...');
      
      // Simulate OAuth redirect
      const redirectUrl = `/api/v1/social/${platformId}/connect`;
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Error connecting platform:', error);
      toast.error('Failed to connect platform');
    }
  };

  const handleDisconnectPlatform = async (accountId: string, platformName: string) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;
      
      setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountId));
      toast.success(`Disconnected from ${platformName}`);
    } catch (error) {
      console.error('Error disconnecting platform:', error);
      toast.error('Failed to disconnect platform');
    }
  };

  const isConnected = (platformId: string) => {
    return connectedAccounts.some(acc => acc.platform === platformId && acc.status === 'active');
  };

  const getConnectedAccount = (platformId: string) => {
    return connectedAccounts.find(acc => acc.platform === platformId && acc.status === 'active');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-2xl font-bold text-foreground">Loading Settings</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Profile & Settings</h1>
          </div>
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6 max-w-4xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
                      value={profile.full_name || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profile.username || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Choose a username"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={profile.bio || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={profile.website || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://your-website.com"
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Characters Tab */}
          <TabsContent value="characters">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>My Characters</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Create and manage characters to use in your stories
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Character Creation */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Create New Character</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add a new character with custom details and image
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Character
                  </Button>
                </div>

                {/* Character List */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Your Characters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Sample Pre-created Characters */}
                    <div className="border rounded-lg p-4 bg-card">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl">
                        A
                      </div>
                      <h4 className="font-medium text-center mb-2">Alex the Adventurer</h4>
                      <p className="text-xs text-muted-foreground text-center mb-3">
                        Brave explorer who loves discovering new places
                      </p>
                      <div className="flex justify-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-card">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl">
                        M
                      </div>
                      <h4 className="font-medium text-center mb-2">Maya the Magician</h4>
                      <p className="text-xs text-muted-foreground text-center mb-3">
                        Wise wizard with powerful magical abilities
                      </p>
                      <div className="flex justify-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-card">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl">
                        R
                      </div>
                      <h4 className="font-medium text-center mb-2">Rex the Robot</h4>
                      <p className="text-xs text-muted-foreground text-center mb-3">
                        Friendly robot companion for sci-fi adventures
                      </p>
                      <div className="flex justify-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Character Import Options */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3">Character Import</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Upload Character Image</Label>
                        <p className="text-sm text-muted-foreground">Upload custom character portraits</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Use Pre-created Characters</Label>
                        <p className="text-sm text-muted-foreground">Choose from our character library</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Browse Library
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LinkIcon className="w-5 h-5" />
                    <span>Connected Accounts</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Connect your social media accounts to publish content directly from StoryBuds
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const connected = isConnected(platform.id);
                    const account = getConnectedAccount(platform.id);
                    
                    return (
                      <div key={platform.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{platform.icon}</div>
                          <div>
                            <div className="font-medium flex items-center space-x-2">
                              <span>{platform.name}</span>
                              {connected && (
                                <Badge variant="default" className="text-xs">
                                  <Check className="w-3 h-3 mr-1" />
                                  Connected
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {connected ? `@${account?.platform_username || 'Connected'}` : platform.description}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {connected ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDisconnectPlatform(account.id, platform.name)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Disconnect
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`https://${platform.id}.com`, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => handleConnectPlatform(platform.id)}
                              size="sm"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications?.email || false}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications?.push || false}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, push: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive tips and updates</p>
                    </div>
                    <Switch
                      checked={settings.notifications?.marketing || false}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, marketing: checked }
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Content & Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-publish to Social Media</Label>
                      <p className="text-sm text-muted-foreground">Automatically share new stories</p>
                    </div>
                    <Switch
                      checked={settings.content?.auto_publish || false}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          content: { ...prev.content, auto_publish: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Content Approval</Label>
                      <p className="text-sm text-muted-foreground">Review content before publishing</p>
                    </div>
                    <Switch
                      checked={settings.content?.content_approval !== false}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          content: { ...prev.content, content_approval: checked }
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Security & Privacy</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                  </div>
                  <Switch
                    checked={settings.privacy?.profile_public || false}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, profile_public: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Stories</Label>
                    <p className="text-sm text-muted-foreground">Allow others to discover your stories</p>
                  </div>
                  <Switch
                    checked={settings.privacy?.stories_public !== false}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, stories_public: checked }
                      }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-destructive">Danger Zone</Label>
                  <div className="mt-2 p-4 border border-destructive/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Delete Account</div>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}