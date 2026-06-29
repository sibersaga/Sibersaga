import React, { useState, useEffect } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken 
} from '../lib/googleAuth';
import { User } from 'firebase/auth';
import { 
  Cloud, 
  Database, 
  Mail, 
  FileText, 
  Plus, 
  Trash, 
  ExternalLink, 
  Send, 
  RefreshCw, 
  LogOut, 
  Lock, 
  ShieldCheck, 
  CheckCircle,
  FolderPlus,
  ArrowRight,
  User as UserIcon,
  Search,
  FileEdit
} from 'lucide-react';

export const Workspace: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'drive' | 'sheets' | 'gmail' | 'forms' | 'docs' | 'sibersaga'>('sibersaga');

  // Sistem SDN 3 Purwosari Integration State
  const [integrationConfig, setIntegrationConfig] = useState({
    spreadsheetId: '',
    spreadsheetUrl: '',
    formId: '',
    formUrl: '',
    formPublicUrl: '',
    isActive: false
  });

  const fetchIntegrationConfig = async () => {
    try {
      const res = await fetch('/api/google-integration');
      if (res.ok) {
        const data = await res.json();
        setIntegrationConfig(data);
      }
    } catch (err) {
      console.error('Error fetching integration config:', err);
    }
  };

  const handleToggleSystemIntegration = async () => {
    const updated = { ...integrationConfig, isActive: !integrationConfig.isActive };
    try {
      const res = await fetch('/api/google-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setIntegrationConfig(updated);
        setSuccessMsg(updated.isActive ? 'Sinkronisasi otomatis Sistem SDN 3 Purwosari diaktifkan!' : 'Sinkronisasi otomatis Sistem SDN 3 Purwosari dinonaktifkan.');
      } else {
        throw new Error('Gagal menyimpan status integrasi.');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateSystemIntegration = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      // 1. Create Spreadsheet titled "Sistem SDN 3 Purwosari"
      const sheetRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: 'Sistem SDN 3 Purwosari'
          }
        })
      });
      
      if (!sheetRes.ok) throw new Error('Gagal membuat Google Spreadsheet "Sistem SDN 3 Purwosari". Pastikan akun Google Anda memiliki akses.');
      const sheetData = await sheetRes.json();
      const newSpreadsheetId = sheetData.spreadsheetId;
      const newSpreadsheetUrl = sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${newSpreadsheetId}`;

      // Write initial headers to the Spreadsheet
      const writeHeaderRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${newSpreadsheetId}/values/Sheet1!A1:F1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [
              ["Waktu", "Nama Lengkap", "Nomor Telepon/WA", "Alamat Email", "Subjek Pesan", "Isi Pesan / Pengaduan"]
            ]
          })
        }
      );
      if (!writeHeaderRes.ok) throw new Error('Gagal menulis baris judul (header) ke Spreadsheet Sistem SDN 3 Purwosari.');

      // 2. Create Google Form titled "Sistem SDN 3 Purwosari - Layanan Publik & Pengaduan"
      const formRes = await fetch('https://forms.googleapis.com/v1/forms', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          info: {
            title: 'Sistem SDN 3 Purwosari - Layanan Publik & Pengaduan',
            documentTitle: 'Sistem SDN 3 Purwosari'
          }
        })
      });
      
      if (!formRes.ok) throw new Error('Gagal membuat Google Form "Sistem SDN 3 Purwosari".');
      const formData = await formRes.json();
      const newFormId = formData.formId;
      const newFormUrl = `https://docs.google.com/forms/d/${newFormId}/edit`;
      const newFormPublicUrl = formData.responderUri || `https://docs.google.com/forms/d/e/${newFormId}/viewform`;

      // 3. Add questions to the Form via batchUpdate
      const addQuestionsRes = await fetch(`https://forms.googleapis.com/v1/forms/${newFormId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              createItem: {
                item: {
                  title: 'Nama Lengkap',
                  questionItem: {
                    question: {
                      required: true,
                      textQuestion: {}
                    }
                  }
                },
                location: { index: 0 }
              }
            },
            {
              createItem: {
                item: {
                  title: 'Nomor Telepon/WA',
                  questionItem: {
                    question: {
                      required: true,
                      textQuestion: {}
                    }
                  }
                },
                location: { index: 1 }
              }
            },
            {
              createItem: {
                item: {
                  title: 'Alamat Email (Opsional)',
                  questionItem: {
                    question: {
                      required: false,
                      textQuestion: {}
                    }
                  }
                },
                location: { index: 2 }
              }
            },
            {
              createItem: {
                item: {
                  title: 'Subjek Pesan',
                  questionItem: {
                    question: {
                      required: true,
                      choiceQuestion: {
                        type: 'DROP_DOWN',
                        options: [
                          { value: 'Pertanyaan Umum / Konsultasi' },
                          { value: 'Penerimaan Siswa Baru (PPDB)' },
                          { value: 'Pengaduan Layanan Sekolah' },
                          { value: 'Kritik, Saran, & Apresiasi' }
                        ]
                      }
                    }
                  }
                },
                location: { index: 3 }
              }
            },
            {
              createItem: {
                item: {
                  title: 'Isi Pesan / Pengaduan *',
                  questionItem: {
                    question: {
                      required: true,
                      textQuestion: { paragraph: true }
                    }
                  }
                },
                location: { index: 4 }
              }
            }
          ]
        })
      });

      if (!addQuestionsRes.ok) throw new Error('Gagal menambahkan daftar pertanyaan wajib ke Google Form.');

      // 4. Save to our Server API
      const updatedConfig = {
        spreadsheetId: newSpreadsheetId,
        spreadsheetUrl: newSpreadsheetUrl,
        formId: newFormId,
        formUrl: newFormUrl,
        formPublicUrl: newFormPublicUrl,
        isActive: true
      };

      const saveRes = await fetch('/api/google-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedConfig)
      });

      if (!saveRes.ok) throw new Error('Gagal menyimpan konfigurasi integrasi ke server aplikasi.');

      setIntegrationConfig(updatedConfig);
      setSuccessMsg('Integrasi Sistem SDN 3 Purwosari Google Form & Spreadsheet berhasil dibuat dan aktif sepenuhnya!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat menyiapkan Integrasi Sistem SDN 3 Purwosari.');
    } finally {
      setLoading(false);
    }
  };

  // Common UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Drive States
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);

  // Sheets States
  const [spreadsheets, setSpreadsheets] = useState<any[]>([]);
  const [selectedSheetId, setSelectedSheetId] = useState<string>('');
  const [sheetData, setSheetData] = useState<any>(null);
  const [newSheetTitle, setNewSheetTitle] = useState('');
  const [newRowData, setNewRowData] = useState<string>('');

  // Gmail States
  const [emails, setEmails] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Forms States
  const [formsList, setFormsList] = useState<any[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [formResponses, setFormResponses] = useState<any[]>([]);
  const [formSchema, setFormSchema] = useState<any>(null);

  // Docs States
  const [docsList, setDocsList] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [docContent, setDocContent] = useState<string>('');
  const [newDocTitle, setNewDocTitle] = useState<string>('');
  const [docDetails, setDocDetails] = useState<any>(null);
  const [docEditingText, setDocEditingText] = useState<string>('');

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, cachedToken) => {
        setUser(user);
        setToken(cachedToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch initial tab data when token or tab changes
  useEffect(() => {
    fetchIntegrationConfig();
    if (token) {
      setError(null);
      setSuccessMsg(null);
      if (activeTab === 'drive') {
        fetchDriveFiles();
      } else if (activeTab === 'sheets') {
        fetchSpreadsheets();
      } else if (activeTab === 'gmail') {
        fetchEmails();
      } else if (activeTab === 'forms') {
        fetchForms();
      } else if (activeTab === 'docs') {
        fetchDocs();
      }
    }
  }, [token, activeTab]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setError('Gagal masuk ke Google Account. Pastikan koneksi internet aktif.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      // Reset all states
      setDriveFiles([]);
      setSpreadsheets([]);
      setEmails([]);
      setFormsList([]);
      setDocsList([]);
      setSelectedDocId('');
      setDocContent('');
      setDocDetails(null);
      setDocEditingText('');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // --- GOOGLE DRIVE OPERATIONS ---
  const fetchDriveFiles = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const queryStr = searchQuery 
        ? `name contains '${searchQuery}' and trashed = false` 
        : "trashed = false";
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(queryStr)}&fields=files(id,name,mimeType,webViewLink,size,createdTime)&orderBy=modifiedTime desc`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error('Gagal memuat berkas Google Drive');
      const data = await response.json();
      setDriveFiles(data.files || []);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat berkas.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newFolderName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newFolderName,
          mimeType: 'application/vnd.google-apps.folder'
        })
      });
      if (!response.ok) throw new Error('Gagal membuat folder baru');
      setNewFolderName('');
      setSuccessMsg(`Folder baru berhasil dibuat.`);
      fetchDriveFiles();
    } catch (err: any) {
      setError(err.message || 'Gagal membuat folder.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    // MANDATORY USER CONFIRMATION
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus "${fileName}" dari Google Drive? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal menghapus berkas');
      setSuccessMsg(`"${fileName}" berhasil dihapus.`);
      fetchDriveFiles();
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus berkas.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !uploadingFile) return;
    setLoading(true);
    setError(null);
    try {
      const metadata = {
        name: uploadingFile.name,
        mimeType: uploadingFile.type
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', uploadingFile);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      if (!response.ok) throw new Error('Gagal mengunggah berkas');
      setUploadingFile(null);
      setSuccessMsg('Berkas berhasil diunggah ke Google Drive Anda.');
      fetchDriveFiles();
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah berkas.');
    } finally {
      setLoading(false);
    }
  };


  // --- GOOGLE SHEETS OPERATIONS ---
  const fetchSpreadsheets = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const queryStr = "mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false";
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(queryStr)}&fields=files(id,name,webViewLink)`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error('Gagal memuat daftar Google Sheets');
      const data = await response.json();
      setSpreadsheets(data.files || []);
      if (data.files && data.files.length > 0 && !selectedSheetId) {
        setSelectedSheetId(data.files[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat Spreadsheet.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSheetContent = async (sheetId: string) => {
    if (!token || !sheetId) return;
    setLoading(true);
    setError(null);
    setSheetData(null);
    try {
      // Get first sheet data range (A1:G100)
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:G100`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error('Gagal memuat isi lembar data Spreadsheet');
      const data = await response.json();
      setSheetData(data.values || []);
    } catch (err: any) {
      setError('Gagal membaca isi tabel. Pastikan lembar sebar tidak kosong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newSheetTitle.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: newSheetTitle
          }
        })
      });
      if (!response.ok) throw new Error('Gagal membuat Spreadsheet baru');
      const resData = await response.json();
      setNewSheetTitle('');
      setSuccessMsg('Spreadsheet baru berhasil dibuat.');
      setSelectedSheetId(resData.spreadsheetId);
      fetchSpreadsheets();
    } catch (err: any) {
      setError(err.message || 'Gagal membuat Google Sheets.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppendRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedSheetId || !newRowData.trim()) return;
    
    // MANDATORY USER CONFIRMATION
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menambahkan data baru ini ke Spreadsheet?'
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    try {
      // Split raw input by comma to form columns
      const cols = newRowData.split(',').map(s => s.trim());
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${selectedSheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            range: 'A1',
            majorDimension: 'ROWS',
            values: [cols]
          })
        }
      );
      if (!response.ok) throw new Error('Gagal menulis baris baru ke Spreadsheet');
      setNewRowData('');
      setSuccessMsg('Baris baru berhasil ditambahkan.');
      fetchSheetContent(selectedSheetId);
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan baris baru.');
    } finally {
      setLoading(false);
    }
  };


  // --- GMAIL OPERATIONS ---
  const fetchEmails = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=8',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error('Gagal memuat pesan Gmail');
      const listData = await response.json();
      const messages = listData.messages || [];
      
      // Fetch details of each message
      const detailedEmails = await Promise.all(
        messages.map(async (msg: any) => {
          const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          if (!detailRes.ok) return null;
          const detail = await detailRes.json();
          
          const headers = detail.payload?.headers || [];
          const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
          const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
          const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';
          
          return {
            id: detail.id,
            subject,
            from,
            snippet: detail.snippet,
            date,
            body: detail.payload?.parts?.[0]?.body?.data || detail.payload?.body?.data || ''
          };
        })
      );
      
      setEmails(detailedEmails.filter(Boolean));
    } catch (err: any) {
      setError(err.message || 'Gagal memuat pesan Gmail.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !emailTo || !emailSubject || !emailBody) return;

    // MANDATORY USER CONFIRMATION
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin mengirim email ini ke "${emailTo}" menggunakan akun Gmail Anda?`
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    try {
      const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(emailSubject)))}?=`;
      const emailStr = [
        `To: ${emailTo}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        emailBody
      ].join('\r\n');

      const base64Safe = btoa(unescape(encodeURIComponent(emailStr)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raw: base64Safe
        })
      });

      if (!response.ok) throw new Error('Gagal mengirim email');
      
      setEmailTo('');
      setEmailSubject('');
      setEmailBody('');
      setSuccessMsg('Email berhasil terkirim melalui server Gmail.');
      fetchEmails();
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim email.');
    } finally {
      setLoading(false);
    }
  };


  // --- GOOGLE FORMS OPERATIONS ---
  const fetchForms = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      // Find Forms in user's Drive
      const queryStr = "mimeType = 'application/vnd.google-apps.form' and trashed = false";
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(queryStr)}&fields=files(id,name,webViewLink)`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error('Gagal memuat formulir Google Forms');
      const data = await response.json();
      setFormsList(data.files || []);
      if (data.files && data.files.length > 0 && !selectedFormId) {
        setSelectedFormId(data.files[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat Formulir.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFormDetailsAndResponses = async (formId: string) => {
    if (!token || !formId) return;
    setLoading(true);
    setError(null);
    setFormSchema(null);
    setFormResponses([]);
    try {
      // 1. Fetch Form Schema (body, questions)
      const schemaRes = await fetch(
        `https://forms.googleapis.com/v1/forms/${formId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!schemaRes.ok) throw new Error('Gagal membaca detail pertanyaan formulir');
      const schemaData = await schemaRes.json();
      setFormSchema(schemaData);

      // 2. Fetch Form Responses
      const responsesRes = await fetch(
        `https://forms.googleapis.com/v1/forms/${formId}/responses`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!responsesRes.ok) throw new Error('Gagal membaca respon pengisian formulir');
      const responsesData = await responsesRes.json();
      setFormResponses(responsesData.responses || []);
    } catch (err: any) {
      setError('Formulir ini tidak memiliki respon yang masuk atau autentikasi tidak memadai.');
    } finally {
      setLoading(false);
    }
  };


  // --- GOOGLE DOCS OPERATIONS ---
  const fetchDocs = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const queryStr = "mimeType = 'application/vnd.google-apps.document' and trashed = false";
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(queryStr)}&fields=files(id,name,webViewLink,createdTime,modifiedTime)&orderBy=modifiedTime desc`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error('Gagal memuat daftar dokumen Google Docs');
      const data = await response.json();
      setDocsList(data.files || []);
      if (data.files && data.files.length > 0 && !selectedDocId) {
        setSelectedDocId(data.files[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat dokumen Google Docs.');
    } finally {
      setLoading(false);
    }
  };

  const extractTextFromDoc = (docJson: any): string => {
    if (!docJson.body || !docJson.body.content) return '';
    let text = '';
    docJson.body.content.forEach((element: any) => {
      if (element.paragraph) {
        element.paragraph.elements?.forEach((el: any) => {
          if (el.textRun && el.textRun.content) {
            text += el.textRun.content;
          }
        });
      }
    });
    return text;
  };

  const fetchDocDetailsAndContent = async (docId: string) => {
    if (!token || !docId) return;
    setLoading(true);
    setError(null);
    setDocDetails(null);
    setDocContent('');
    setDocEditingText('');
    try {
      const response = await fetch(`https://docs.googleapis.com/v1/documents/${docId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal memuat isi dokumen Google Docs');
      const data = await response.json();
      setDocDetails(data);
      const extracted = extractTextFromDoc(data);
      setDocContent(extracted);
      setDocEditingText(extracted);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat isi Google Docs.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newDocTitle.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newDocTitle
        })
      });
      if (!response.ok) throw new Error('Gagal membuat dokumen Google Docs baru');
      const resData = await response.json();
      setNewDocTitle('');
      setSuccessMsg('Dokumen Google Docs baru berhasil dibuat.');
      setSelectedDocId(resData.documentId);
      fetchDocs();
    } catch (err: any) {
      setError(err.message || 'Gagal membuat Google Docs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDocContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedDocId || !docDetails) return;

    // MANDATORY USER CONFIRMATION
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menyimpan perubahan pada dokumen Google Docs ini?'
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    try {
      const endIndex = docDetails.body.content[docDetails.body.content.length - 1].endIndex;
      const requests = [];

      // 1. Delete existing content (if any)
      if (endIndex > 2) {
        requests.push({
          deleteContentRange: {
            range: {
              startIndex: 1,
              endIndex: endIndex - 1
            }
          }
        });
      }

      // 2. Insert new content at index 1
      requests.push({
        insertText: {
          location: {
            index: 1
          },
          text: docEditingText
        }
      });

      const response = await fetch(`https://docs.googleapis.com/v1/documents/${selectedDocId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests
        })
      });

      if (!response.ok) throw new Error('Gagal menyimpan perubahan ke dokumen Google Docs');
      setSuccessMsg('Dokumen Google Docs berhasil diperbarui.');
      fetchDocDetailsAndContent(selectedDocId);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan perubahan dokumen.');
    } finally {
      setLoading(false);
    }
  };


  // Quick fetch trigger when dropdown items change
  useEffect(() => {
    if (selectedSheetId && token) {
      fetchSheetContent(selectedSheetId);
    }
  }, [selectedSheetId, token]);

  useEffect(() => {
    if (selectedFormId && token) {
      fetchFormDetailsAndResponses(selectedFormId);
    }
  }, [selectedFormId, token]);

  useEffect(() => {
    if (selectedDocId && token) {
      fetchDocDetailsAndContent(selectedDocId);
    }
  }, [selectedDocId, token]);


  return (
    <div className={`space-y-8 animate-fadeIn ${isEmbedded ? '' : 'py-6'}`} id="workspace-page">
      {/* Jumbotron */}
      {!isEmbedded && (
        <section className="bg-gradient-to-br from-primary-600 to-sky-700 text-white rounded-3xl overflow-hidden py-14 px-6 sm:px-12 text-center relative shadow-lg" id="workspace-jumbotron">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent)] pointer-events-none" />
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="text-xs bg-emerald-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 w-fit mx-auto shadow-sm">
              <ShieldCheck size={14} />
              KONEKSI RESMI GOOGLE WORKSPACE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Integrasi Layanan Google Workspace
            </h2>
            <p className="text-sm text-slate-100 font-medium max-w-2xl mx-auto leading-relaxed">
              Kelola data operasional SDN 3 Purwosari secara langsung. Hubungkan akun Anda untuk membaca & menulis berkas, mengelola Spreadsheet, memantau pengisian Formulir, serta mengirim email dinas.
            </p>
          </div>
        </section>
      )}

      {/* Auth Guard Interface */}
      {needsAuth ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto py-8">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center p-3 bg-sky-100 text-sky-600 rounded-2xl shadow-inner">
              <Lock size={28} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
              Akses Sistem Terintegrasi Sistem SDN 3 Purwosari
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Akses panel manajemen untuk staf dan pengelola SDN 3 Purwosari. Membutuhkan autentikasi Google Workspace untuk keamanan data sekolah dan sinkronisasi layanan operasional langsung dari satu tempat.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Cloud size={18} /></div>
                <span className="text-xs font-bold text-slate-700">Google Drive</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Database size={18} /></div>
                <span className="text-xs font-bold text-slate-700">Google Sheets</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FileText size={18} /></div>
                <span className="text-xs font-bold text-slate-700">Google Forms</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Mail size={18} /></div>
                <span className="text-xs font-bold text-slate-700">Gmail Dinas</span>
              </div>
            </div>
          </div>
          
          <section className="bg-white p-8 rounded-3xl shadow-xl border border-sky-100 text-center space-y-6 relative overflow-hidden" id="workspace-auth-guard">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <ShieldCheck size={120} />
            </div>
            
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-bold text-slate-800">Autentikasi Staf & Admin</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Silakan masuk menggunakan akun Google Anda untuk mengakses fitur Sistem SDN 3 Purwosari.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold text-left relative z-10">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 justify-center items-center pt-4 relative z-10">
              <button 
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-sm rounded-xl border border-slate-300 shadow-sm flex items-center justify-center gap-3 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                <span>{isLoggingIn ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}</span>
              </button>
              <div className="flex items-center gap-1.5 mt-2">
                <Lock size={10} className="text-slate-400" />
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Koneksi Aman & Terenkripsi
                </span>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-8" id="workspace-dashboard">
          {/* User Status Bar */}
          <div className="bg-white p-4 px-6 rounded-3xl border border-sky-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 overflow-hidden border border-sky-200">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Google User'} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="text-sky-600 m-2" size={24} />
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-tight">
                  Tersambung sebagai: {user?.displayName || 'Staf SDN 3 Purwosari'}
                </h4>
                <p className="text-xs text-sky-600 font-semibold">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={handleLogout}
                className="w-full md:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-red-100">
              <span className="font-extrabold uppercase">Eror:</span> {error}
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-emerald-100">
              <CheckCircle size={14} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
              <button 
                onClick={() => setSuccessMsg(null)}
                className="ml-auto font-bold uppercase text-[9px] hover:underline"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3" id="workspace-tabs">
            {[
              { id: 'sibersaga', label: 'Integrasi Sistem SDN 3 Purwosari', icon: ShieldCheck, color: 'text-amber-500 bg-amber-50' },
              { id: 'drive', label: 'Google Drive', icon: Cloud, color: 'text-blue-500 bg-blue-50' },
              { id: 'sheets', label: 'Google Sheets', icon: Database, color: 'text-emerald-600 bg-emerald-50' },
              { id: 'docs', label: 'Google Docs', icon: FileEdit, color: 'text-sky-600 bg-sky-50' },
              { id: 'gmail', label: 'Gmail Dinas', icon: Mail, color: 'text-red-500 bg-red-50' },
              { id: 'forms', label: 'Google Forms', icon: FileText, color: 'text-purple-500 bg-purple-50' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-sky-600 text-white shadow-md'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : tab.color.split(' ')[0]} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENTS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 min-h-[400px]">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                <RefreshCw size={32} className="animate-spin text-primary-500" />
                <span className="text-xs font-bold uppercase font-mono">Memuat data dari Google...</span>
              </div>
            )}

            {!loading && activeTab === 'sibersaga' && (
              <div className="space-y-8" id="sibersaga-tab-content">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Integrasi Sistem Sistem SDN 3 Purwosari</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Kelola sinkronisasi otomatis pengaduan dan pesan website SDN 3 Purwosari ke Google Sheets dan Google Forms.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Status & Toggle */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">Status Koneksi</h4>
                      
                      <div className="flex items-center gap-3">
                        <div className={`w-3.5 h-3.5 rounded-full ${integrationConfig.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                        <span className="text-sm font-bold text-slate-800">
                          {integrationConfig.isActive ? 'Terhubung & Aktif' : 'Belum Aktif'}
                        </span>
                      </div>

                      <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                        Setiap kali pengunjung menuliskan pertanyaan atau pengaduan di formulir kontak, data akan dikirim secara otomatis ke Google Form dan Spreadsheet Sistem SDN 3 Purwosari secara real-time.
                      </p>

                      {integrationConfig.formId && (
                        <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">Sinkronisasi Otomatis:</span>
                          <button
                            onClick={handleToggleSystemIntegration}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              integrationConfig.isActive ? 'bg-emerald-600' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                integrationConfig.isActive ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 font-mono">Petunjuk Penting</h4>
                      <ul className="text-[11px] leading-relaxed text-amber-900/80 list-disc pl-4 space-y-1.5 font-semibold">
                        <li>Pastikan Google Drive API, Sheets API, dan Forms API aktif pada kredensial Google Workspace Anda.</li>
                        <li>Tekan tombol "Hubungkan Sistem" untuk membuat formulir & spreadsheet baru secara otomatis.</li>
                        <li>Hubungkan Form ke Spreadsheet di dalam antarmuka Google Forms ("Responses" &rarr; "Link to Sheets" &rarr; pilih Sistem) agar data tersinkronisasi dua arah.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Integration Controls */}
                  <div className="lg:col-span-2 space-y-6">
                    {integrationConfig.formId ? (
                      <div className="p-6 bg-white border border-slate-100 rounded-3xl space-y-6 shadow-xs">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">Detail Dokumen Terintegrasi</h4>
                        
                        <div className="space-y-4">
                          {/* Spreadsheet Link */}
                          <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider font-mono">Google Spreadsheet</span>
                              <h5 className="text-xs font-extrabold text-slate-800">Sistem SDN 3 Purwosari</h5>
                              <p className="text-[10px] text-slate-500 font-mono truncate max-w-[250px] sm:max-w-md">ID: {integrationConfig.spreadsheetId}</p>
                            </div>
                            <a
                              href={integrationConfig.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${integrationConfig.spreadsheetId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shrink-0"
                            >
                              Buka <ExternalLink size={11} />
                            </a>
                          </div>

                          {/* Form Link */}
                          <div className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100 flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase text-purple-800 tracking-wider font-mono">Google Form (Edit)</span>
                              <h5 className="text-xs font-extrabold text-slate-800 font-sans">Sistem SDN 3 Purwosari - Layanan Publik & Pengaduan</h5>
                              <p className="text-[10px] text-slate-500 font-mono truncate max-w-[250px] sm:max-w-md">ID: {integrationConfig.formId}</p>
                            </div>
                            <a
                              href={integrationConfig.formUrl || `https://docs.google.com/forms/d/${integrationConfig.formId}/edit`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shrink-0"
                            >
                              Edit Form <ExternalLink size={11} />
                            </a>
                          </div>

                          {/* Form Public Responder Link */}
                          <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100 flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase text-indigo-800 tracking-wider font-mono">Link Form Publik</span>
                              <h5 className="text-xs font-extrabold text-slate-800 font-sans">Tampilan Pengunjung Website</h5>
                              <p className="text-[10px] text-slate-500 font-mono truncate max-w-[250px] sm:max-w-md">{integrationConfig.formPublicUrl}</p>
                            </div>
                            <a
                              href={integrationConfig.formPublicUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shrink-0"
                            >
                              Isi Form <ExternalLink size={11} />
                            </a>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                          <p className="text-[10px] text-slate-400 font-mono">Konfigurasi tersimpan pada server SDN 3 Purwosari</p>
                          <button
                            onClick={handleCreateSystemIntegration}
                            className="text-[10px] text-red-600 hover:underline font-bold"
                          >
                            Buat Ulang Integrasi &rarr;
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-center space-y-6 flex flex-col items-center justify-center">
                        <Database size={48} className="text-slate-400 animate-pulse" />
                        <div className="max-w-md space-y-2">
                          <h4 className="text-sm font-black text-slate-800">Siapkan Integrasi Otomatis</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Anda belum membuat Google Form & Spreadsheet Sistem. Sistem kami dapat menyiapkannya secara otomatis dalam sekali klik dengan membuat Spreadsheet berjudul "Sistem SDN 3 Purwosari" dan Formulir Pengaduan Publik yang lengkap.
                          </p>
                        </div>

                        <button
                          onClick={handleCreateSystemIntegration}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
                        >
                          <RefreshCw size={13} className="animate-spin-slow" /> Hubungkan Sistem Sekarang
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!loading && activeTab === 'drive' && (
              <div className="space-y-8" id="drive-tab-content">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Penyimpanan Google Drive</h3>
                    <p className="text-xs text-slate-500 mt-1">Unggah dokumen resmi, buat direktori, dan kelola arsip SDN 3 Purwosari.</p>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="flex gap-2 w-full md:w-auto">
                    <input
                      type="text"
                      placeholder="Cari berkas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 flex-grow"
                    />
                    <button 
                      onClick={fetchDriveFiles}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
                    >
                      <Search size={14} />
                    </button>
                  </div>
                </div>

                {/* Operations grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Operation 1: Create Folder */}
                  <form onSubmit={handleCreateFolder} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5 font-mono">
                      <FolderPlus size={14} className="text-blue-500" /> Buat Folder Baru
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nama folder baru..."
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500 flex-grow"
                        required
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Buat
                      </button>
                    </div>
                  </form>

                  {/* Operation 2: Upload File */}
                  <form onSubmit={handleFileUpload} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5 font-mono">
                      <Cloud size={14} className="text-sky-500" /> Unggah Berkas Baru
                    </h4>
                    <div className="flex gap-2 items-center">
                      <input
                        type="file"
                        onChange={(e) => setUploadingFile(e.target.files?.[0] || null)}
                        className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer flex-grow"
                        required
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Unggah
                      </button>
                    </div>
                  </form>
                </div>

                {/* File list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest font-mono">Daftar Berkas Terkini</h4>
                  {driveFiles.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl">
                      Tidak ada berkas yang ditemukan di Google Drive.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                      {driveFiles.map((file) => (
                        <div key={file.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4 text-xs">
                          <div className="space-y-1 min-w-0">
                            <h5 className="font-bold text-slate-800 truncate" title={file.name}>{file.name}</h5>
                            <p className="text-[10px] text-slate-400 font-mono">
                              ID: {file.id} • {file.mimeType.replace('application/vnd.google-apps.', '')}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <a 
                              href={file.webViewLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors border border-sky-100"
                              title="Buka Berkas di Google Drive"
                            >
                              <ExternalLink size={14} />
                            </a>
                            <button
                              onClick={() => handleDeleteFile(file.id, file.name)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                              title="Hapus Berkas"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {!loading && activeTab === 'sheets' && (
              <div className="space-y-8" id="sheets-tab-content">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Manajemen Google Sheets</h3>
                    <p className="text-xs text-slate-500 mt-1">Kelola arsip log, formulir entri data, dan tabel statistik resmi.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Create Sheet Form */}
                    <form onSubmit={handleCreateSheet} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Judul tabel baru..."
                        value={newSheetTitle}
                        onChange={(e) => setNewSheetTitle(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        required
                      />
                      <button 
                        type="submit"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer whitespace-nowrap flex items-center gap-1"
                      >
                        <Plus size={12} /> Buat Baru
                      </button>
                    </form>
                  </div>
                </div>

                {/* Spreadsheet selector */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-bold text-slate-600 uppercase font-mono shrink-0">Pilih Tabel:</span>
                    <select
                      value={selectedSheetId}
                      onChange={(e) => setSelectedSheetId(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full sm:w-64"
                    >
                      {spreadsheets.length === 0 ? (
                        <option value="">(Tidak ada Spreadsheet di Drive)</option>
                      ) : (
                        spreadsheets.map((sheet) => (
                          <option key={sheet.id} value={sheet.id}>{sheet.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                  
                  {selectedSheetId && (
                    <a 
                      href={`https://docs.google.com/spreadsheets/d/${selectedSheetId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline text-xs font-bold flex items-center gap-1"
                    >
                      Buka di Google Sheets <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {selectedSheetId && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Add Row Form */}
                    <form onSubmit={handleAppendRow} className="lg:col-span-4 p-5 bg-white border border-slate-100 shadow-sm rounded-2xl space-y-4">
                      <div>
                        <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider font-mono">Tambah Baris Baru</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Pisahkan tiap kolom dengan tanda koma (misal: "Budi, 2026-06-27, Purwosari")</p>
                      </div>
                      
                      <div className="space-y-2">
                        <textarea
                          placeholder="Kolom1, Kolom2, Kolom3..."
                          value={newRowData}
                          onChange={(e) => setNewRowData(e.target.value)}
                          className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow"
                      >
                        <Send size={12} /> Kirim ke Spreadsheet
                      </button>
                    </form>

                    {/* Sheet Content Preview */}
                    <div className="lg:col-span-8 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest font-mono">Isi Tabel Terkini (Maks. 100 Baris)</h4>
                        <button 
                          onClick={() => fetchSheetContent(selectedSheetId)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                        >
                          <RefreshCw size={10} /> Segarkan
                        </button>
                      </div>

                      {!sheetData || sheetData.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                          Tabel data kosong atau tidak dapat diuraikan.
                        </div>
                      ) : (
                        <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-inner max-h-[350px]">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500 font-mono sticky top-0">
                              <tr>
                                {sheetData[0].map((header: string, i: number) => (
                                  <th key={i} className="p-3 px-4">{header}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {sheetData.slice(1).map((row: any[], i: number) => (
                                <tr key={i} className="hover:bg-slate-50/50">
                                  {row.map((cell: string, j: number) => (
                                    <td key={j} className="p-3 px-4 text-slate-700 font-medium">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === 'docs' && (
              <div className="space-y-8" id="docs-tab-content">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Dokumen Google Docs</h3>
                    <p className="text-xs text-slate-500 mt-1">Buat dokumen dinas baru, sunting laporan sekolah, dan kelola draf administrasi.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Create Doc Form */}
                    <form onSubmit={handleCreateDoc} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Judul dokumen baru..."
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        required
                      />
                      <button 
                        type="submit"
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl cursor-pointer whitespace-nowrap flex items-center gap-1"
                      >
                        <Plus size={12} /> Buat Dokumen
                      </button>
                    </form>
                  </div>
                </div>

                {/* Doc Selector */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-bold text-slate-600 uppercase font-mono shrink-0">Pilih Dokumen:</span>
                    <select
                      value={selectedDocId}
                      onChange={(e) => setSelectedDocId(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full sm:w-64"
                    >
                      {docsList.length === 0 ? (
                        <option value="">(Tidak ada Google Docs di Drive)</option>
                      ) : (
                        docsList.map((doc) => (
                          <option key={doc.id} value={doc.id}>{doc.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                  
                  {selectedDocId && (
                    <a 
                      href={`https://docs.google.com/document/d/${selectedDocId}/edit`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:underline text-xs font-bold flex items-center gap-1"
                    >
                      Buka di Google Docs <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {selectedDocId && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Doc Metadata Details */}
                    <div className="lg:col-span-4 p-5 bg-white border border-slate-100 shadow-sm rounded-2xl space-y-4">
                      <div>
                        <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider font-mono">Informasi Dokumen</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Status dan properti berkas dokumen dinas saat ini.</p>
                      </div>

                      {docDetails ? (
                        <div className="space-y-3 text-xs">
                          <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-400 block">ID Dokumen</span>
                              <span className="font-semibold text-slate-800 break-all font-mono text-[10px]">{docDetails.documentId}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-400 block">Judul Berkas</span>
                              <span className="font-bold text-primary-600">{docDetails.title}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-400 block">Jumlah Elemen Konten</span>
                              <span className="font-semibold text-slate-800">{docDetails.body?.content?.length || 0} unit</span>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-blue-50/50 rounded-xl text-[11px] text-slate-600 leading-relaxed font-medium">
                            <span className="font-bold text-blue-800 block mb-1">Catatan Pengarsipan:</span>
                            Semua suntingan yang Anda lakukan di editor sebelah kanan akan disinkronisasikan ke server Google secara real-time setelah Anda menekan tombol Simpan.
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-slate-400 py-6 text-xs font-semibold">
                          Memuat properti dokumen...
                        </div>
                      )}
                    </div>

                    {/* Doc Rich Content Editor */}
                    <form onSubmit={handleSaveDocContent} className="lg:col-span-8 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest font-mono">Editor Isi Dokumen (Sederhana)</h4>
                        <button 
                          type="button"
                          onClick={() => fetchDocDetailsAndContent(selectedDocId)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1 font-bold"
                        >
                          <RefreshCw size={10} /> Atur Ulang / Segarkan
                        </button>
                      </div>

                      <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-primary-500 shadow-sm bg-white">
                        <textarea
                          value={docEditingText}
                          onChange={(e) => setDocEditingText(e.target.value)}
                          placeholder="Ketikkan teks dokumen sekolah di sini..."
                          className="w-full h-80 p-5 text-sm text-slate-800 leading-relaxed font-medium focus:outline-none resize-none bg-slate-50/30"
                        />
                        <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                          <span>Karakter: {docEditingText.length}</span>
                          <span>Autentikasi: Token Akses Google OAuth</span>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow"
                        >
                          <Send size={12} /> Simpan Perubahan Dokumen
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === 'gmail' && (
              <div className="space-y-8" id="gmail-tab-content">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Gmail Dinas Terintegrasi</h3>
                    <p className="text-xs text-slate-500 mt-1">Kirim email pengumuman atau cek surat masuk terkini instansi sekolah.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Send Email Form */}
                  <form onSubmit={handleSendEmail} className="lg:col-span-5 p-5 bg-white border border-slate-100 shadow-sm rounded-2xl space-y-4">
                    <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider font-mono flex items-center gap-1">
                      <Send size={12} className="text-red-500" /> Tulis Pesan Baru
                    </h4>
                    
                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-600">Kepada (Email Tujuan):</label>
                        <input
                          type="email"
                          placeholder="nama@email.com"
                          value={emailTo}
                          onChange={(e) => setEmailTo(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-600">Subjek Surat:</label>
                        <input
                          type="text"
                          placeholder="Pengumuman Penting SDN 3 Purwosari"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-600">Isi Email (Mendukung HTML):</label>
                        <textarea
                          placeholder="Tuliskan isi surat dinas atau informasi di sini..."
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none font-medium"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow"
                    >
                      Kirim Surat via Gmail
                    </button>
                  </form>

                  {/* Mailbox List */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest font-mono">Kotak Masuk Terkini</h4>
                      <button 
                        onClick={fetchEmails}
                        className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                      >
                        <RefreshCw size={10} /> Segarkan
                      </button>
                    </div>

                    {emails.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                        Tidak ada email masuk di inbox.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                        {emails.map((email) => (
                          <div 
                            key={email.id} 
                            onClick={() => setSelectedEmail(email)}
                            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 text-xs cursor-pointer transition-colors"
                          >
                            <div className="flex justify-between items-start gap-3">
                              <span className="font-bold text-slate-800 truncate block w-2/3">{email.from}</span>
                              <span className="text-[9px] text-slate-400 font-mono shrink-0">{email.date.substring(0, 16)}</span>
                            </div>
                            <h5 className="font-semibold text-sky-800 mt-1 line-clamp-1">{email.subject}</h5>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{email.snippet}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Viewer Modal overlay */}
                {selectedEmail && (
                  <div 
                    className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-center p-4 items-center"
                    onClick={() => setSelectedEmail(null)}
                  >
                    <div 
                      className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto space-y-4 shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="border-b border-slate-100 pb-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-black text-slate-800 text-sm">{selectedEmail.from}</h4>
                          <button 
                            onClick={() => setSelectedEmail(null)}
                            className="text-slate-400 hover:text-slate-600 font-bold font-mono text-xs"
                          >
                            Tutup
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">{selectedEmail.date}</p>
                        <h3 className="font-bold text-sky-950 text-md mt-2">{selectedEmail.subject}</h3>
                      </div>
                      
                      <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                        {selectedEmail.snippet}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === 'forms' && (
              <div className="space-y-8" id="forms-tab-content">
                <div>
                  <h3 className="text-lg font-black text-slate-800">Pemantauan Google Forms</h3>
                  <p className="text-xs text-slate-500 mt-1">Dapatkan data survey, umpan balik wali murid, atau respon pendaftaran online secara instan.</p>
                </div>

                {/* Form Selector */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-bold text-slate-600 uppercase font-mono shrink-0">Pilih Formulir:</span>
                    <select
                      value={selectedFormId}
                      onChange={(e) => setSelectedFormId(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full sm:w-64"
                    >
                      {formsList.length === 0 ? (
                        <option value="">(Tidak ada Google Forms di Drive)</option>
                      ) : (
                        formsList.map((form) => (
                          <option key={form.id} value={form.id}>{form.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                  
                  {selectedFormId && (
                    <a 
                      href={`https://docs.google.com/forms/d/${selectedFormId}/edit`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline text-xs font-bold flex items-center gap-1"
                    >
                      Edit Formulir Asli <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {selectedFormId && (
                  <div className="space-y-6">
                    {/* Schema / Questions Preview */}
                    {formSchema && (
                      <div className="p-5 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-3">
                        <h4 className="text-xs font-black uppercase text-purple-800 tracking-wider font-mono">Daftar Pertanyaan Terdaftar</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {formSchema.info && (
                            <div className="col-span-1 md:col-span-2 text-slate-700 font-bold border-b border-purple-100 pb-2">
                              {formSchema.info.title} - <span className="text-slate-500 font-normal">{formSchema.info.description || 'Tidak ada deskripsi'}</span>
                            </div>
                          )}
                          {formSchema.items?.map((item: any) => (
                            <div key={item.itemId} className="p-2.5 bg-white rounded-xl border border-slate-100">
                              <span className="font-extrabold text-slate-800">{item.title}</span>
                              <p className="text-[10px] text-slate-400 mt-0.5">Tipe: {item.questionItem?.question?.textQuestion ? 'Teks Singkat' : 'Pilihan Ganda/Lainnya'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Responses preview */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest font-mono">Tanggapan Responden Terakhir ({formResponses.length})</h4>
                        <button 
                          onClick={() => fetchFormDetailsAndResponses(selectedFormId)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                        >
                          <RefreshCw size={10} /> Segarkan
                        </button>
                      </div>

                      {formResponses.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                          Belum ada respon responden atau formulir ini baru dibuat.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {formResponses.map((resp: any) => (
                            <div key={resp.responseId} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5 mb-2">
                                <span className="font-bold text-sky-800 font-mono text-[10px]">RESPON ID: {resp.responseId.substring(0, 10)}...</span>
                                <span className="text-slate-400 text-[10px] font-mono">{resp.createTime?.substring(0, 16)}</span>
                              </div>
                              <div className="space-y-1">
                                {Object.values(resp.answers || {}).map((ans: any) => (
                                  <div key={ans.questionId} className="grid grid-cols-3 gap-2">
                                    <span className="col-span-1 text-slate-500 truncate font-bold">Pertanyaan ID {ans.questionId.substring(0, 6)}:</span>
                                    <span className="col-span-2 text-slate-800 font-semibold">{ans.textAnswers?.answers?.[0]?.value || '-'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
