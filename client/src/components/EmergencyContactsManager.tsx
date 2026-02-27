import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Plus, Trash2, AlertCircle, CheckCircle, User, PhoneCall, Heart, Loader2 } from 'lucide-react';

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface Props {
  contacts: EmergencyContact[];
  onUpdate: (contacts: EmergencyContact[]) => Promise<void>;
}

export default function EmergencyContactsManager({ contacts, onUpdate }: Props) {
  const [localContacts, setLocalContacts] = useState<EmergencyContact[]>(contacts || []);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const addContact = () => {
    if (!newContact.name || !newContact.phone) {
      setError('Name and phone number are required');
      return;
    }

    // Validate phone format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(newContact.phone.replace(/[\s-]/g, ''))) {
      setError('Please enter a valid phone number (e.g., +1234567890)');
      return;
    }

    const updatedContacts = [...localContacts, newContact];
    setLocalContacts(updatedContacts);
    setNewContact({ name: '', phone: '', relationship: '' });
    setError('');
    setIsAddingNew(false);
  };

  const removeContact = (index: number) => {
    const updatedContacts = localContacts.filter((_, i) => i !== index);
    setLocalContacts(updatedContacts);
  };

  const saveContacts = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await onUpdate(localContacts);
      setSuccess('Emergency contacts saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="glass-strong border-red-500/20 shadow-lg">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shadow-lg">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Emergency Contacts</CardTitle>
              <CardDescription className="text-base mt-1">
                Add trusted contacts who will be notified if you're in crisis
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Alerts */}
          {error && (
            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950 animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          {/* Info Alert */}
          <Alert className="border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 dark:text-blue-100">
              These contacts will receive an automated AI-powered call and SMS if our system detects you're in severe distress during a conversation.
            </AlertDescription>
          </Alert>

          {/* Existing Contacts */}
          {localContacts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Your Emergency Contacts ({localContacts.length})</Label>
              </div>
              <div className="grid gap-3">
                {localContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="group relative p-4 rounded-xl bg-gradient-to-br from-background to-muted/30 border border-border/50 hover:border-red-500/30 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-lg text-foreground truncate">{contact.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <PhoneCall className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <p className="text-sm text-muted-foreground font-mono">{contact.phone}</p>
                            </div>
                            {contact.relationship && (
                              <div className="flex items-center gap-2 mt-1">
                                <Heart className="w-4 h-4 text-red-400 flex-shrink-0" />
                                <p className="text-sm text-muted-foreground capitalize">{contact.relationship}</p>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeContact(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Contact Section */}
          {!isAddingNew && (
            <Button
              onClick={() => setIsAddingNew(true)}
              variant="outline"
              className="w-full h-14 border-dashed border-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Emergency Contact
            </Button>
          )}

          {isAddingNew && (
            <div className="space-y-4 p-6 rounded-xl border-2 border-dashed border-red-500/50 bg-red-50/30 dark:bg-red-950/10 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-lg font-semibold">Add New Contact</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewContact({ name: '', phone: '', relationship: '' });
                    setError('');
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-sm font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="contact-name"
                      placeholder="John Doe"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      className="pl-10 h-12 bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-phone" className="text-sm font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="contact-phone"
                      placeholder="+1234567890"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      className="pl-10 h-12 bg-background font-mono"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Include country code (e.g., +1 for US, +44 for UK)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-relationship" className="text-sm font-medium">
                    Relationship (Optional)
                  </Label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="contact-relationship"
                      placeholder="Friend, Family, Therapist..."
                      value={newContact.relationship}
                      onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                      className="pl-10 h-12 bg-background"
                    />
                  </div>
                </div>

                <Button
                  onClick={addContact}
                  className="w-full h-12 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </div>
          )}

          {/* Save Button */}
          {localContacts.length > 0 && (
            <div className="pt-4 border-t border-border/50">
              <Button
                onClick={saveContacts}
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg font-semibold shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Save Emergency Contacts
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Crisis Resources */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100 mb-2 text-lg">
                  🆘 In Immediate Crisis?
                </p>
                <div className="text-sm text-red-800 dark:text-red-200 space-y-1.5">
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Call <strong>988</strong> - Suicide & Crisis Lifeline
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Call <strong>911</strong> - Emergency Services
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Text <strong>HOME</strong> to <strong>741741</strong> - Crisis Text Line
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
