import React, { useState, useEffect, useCallback } from 'react';
import { Website, Section, ThemeConfig, BusinessInfo, SectionType } from '../types/schema';
import { EditorTopBar } from '../components/editor/EditorTopBar';
import { EditorLeftSidebar } from '../components/editor/EditorLeftSidebar';
import { EditorRightSidebar } from '../components/editor/EditorRightSidebar';
import { AddSectionModal } from '../components/editor/AddSectionModal';
import { WebsiteRenderer } from '../components/renderer/WebsiteRenderer';
import { useAuth } from '../context/AuthContext';
import { websiteService } from '../services/website.service';
import { sectionService } from '../services/section.service';
import { CheckCircle2, Copy, ExternalLink, Globe, X } from 'lucide-react';

interface Props {
  websiteId: string;
  onBackToDashboard: () => void;
}

export const EditorPage: React.FC<Props> = ({ websiteId, onBackToDashboard }) => {
  const { token, user } = useAuth();
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatusText, setSaveStatusText] = useState<string | null>(null);

  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch website data with sections
  const fetchWebsite = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await websiteService.getWebsiteById(websiteId);
      setWebsite(data);
      if (data.sections && data.sections.length > 0 && !activeSectionId) {
        setActiveSectionId(data.sections[0].id);
      }
    } catch (err) {
      console.error('Failed to load website:', err);
    } finally {
      setLoading(false);
    }
  }, [websiteId, token]);

  useEffect(() => {
    fetchWebsite();
  }, [fetchWebsite]);

  // Save changes to backend
  const handleSave = async () => {
    if (!website || !token) return;
    try {
      setSaving(true);
      setSaveStatusText('Menyimpan perubahan...');

      // Update website metadata
      await websiteService.updateWebsite(website.id, {
        name: website.name,
        slug: website.slug,
        theme: website.theme,
        businessInfo: website.businessInfo,
      });

      // Update sections content and positions
      if (website.sections) {
        const sectionIds = website.sections.map((s) => s.id);
        await sectionService.reorderSections(website.id, sectionIds);

        for (const s of website.sections) {
          await sectionService.updateSection(website.id, s.id, s.content);
        }
      }

      setSaveStatusText('Tersimpan!');
      setTimeout(() => setSaveStatusText(null), 2500);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatusText('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  // Toggle publish state
  const handlePublishToggle = async () => {
    if (!website || !token) return;
    const isCurrentlyPublished = website.status === 'published';

    try {
      setSaving(true);
      if (isCurrentlyPublished) {
        await websiteService.unpublishWebsite(website.id);
      } else {
        await websiteService.publishWebsite(website.id);
      }

      const nextStatus = isCurrentlyPublished ? 'draft' : 'published';
      setWebsite({
        ...website,
        status: nextStatus,
      });

      if (nextStatus === 'published') {
        setPublishModalOpen(true);
      }
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Select and scroll to section
  const handleSelectSection = (id: string) => {
    setActiveSectionId(id);
    setTimeout(() => {
      const el = document.getElementById(`editor-section-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 40);
  };

  // Section reordering
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!website?.sections) return;
    const sections = [...website.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const temp = sections[index];
    sections[index] = sections[targetIndex];
    sections[targetIndex] = temp;

    // update position numbers
    const updated = sections.map((s, idx) => ({ ...s, position: idx }));
    setWebsite({ ...website, sections: updated });
  };

  // Delete section
  const handleDeleteSection = async (sectionId: string) => {
    if (!website?.sections || !token) return;
    if (!window.confirm('Yakin ingin menghapus section ini?')) return;

    try {
      await sectionService.deleteSection(website.id, sectionId);

      const updated = website.sections
        .filter((s) => s.id !== sectionId)
        .map((s, idx) => ({ ...s, position: idx }));

      setWebsite({ ...website, sections: updated });
      if (activeSectionId === sectionId) {
        setActiveSectionId(updated.length > 0 ? updated[0].id : null);
      }
    } catch (err) {
      console.error('Delete section failed:', err);
    }
  };

  // Add new section
  const handleAddSection = async (type: SectionType, defaultContent: any) => {
    if (!website || !token) return;
    try {
      const newSecData = await sectionService.addSection(website.id, type, defaultContent);
      const newSec: Section = {
        id: newSecData.id,
        websiteId: website.id,
        type,
        content: defaultContent,
        position: website.sections ? website.sections.length : 0,
      };
      const currentSections = website.sections || [];
      setWebsite({
        ...website,
        sections: [...currentSections, newSec],
      });
      setActiveSectionId(newSec.id);
    } catch (err) {
      console.error('Add section failed:', err);
    }
  };

  // Update active section content
  const handleUpdateActiveSectionContent = (newContent: any) => {
    if (!website?.sections || !activeSectionId) return;
    const updated = website.sections.map((s) => {
      if (s.id === activeSectionId) {
        return { ...s, content: newContent };
      }
      return s;
    });
    setWebsite({ ...website, sections: updated });
  };

  // Update section content by section ID directly (for canvas drag-and-drop)
  const handleUpdateSectionContentById = (sectionId: string, newContent: any) => {
    if (!website?.sections) return;
    const updated = website.sections.map((s) => {
      if (s.id === sectionId) {
        return { ...s, content: newContent };
      }
      return s;
    });
    setWebsite({ ...website, sections: updated });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600">Memuat Visual Editor...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Website Tidak Ditemukan</h2>
          <p className="text-sm text-slate-600">Website mungkin telah dihapus atau Anda tidak memiliki akses.</p>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const activeSection = website.sections?.find((s) => s.id === activeSectionId) || null;
  const publicUrl = `${window.location.origin}/sites/${website.slug}`;

  // Viewport width styling
  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] h-[calc(100vh-100px)] min-h-[520px] max-h-[860px] my-auto mx-auto shadow-2xl rounded-3xl border-4 border-slate-800 bg-white overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain touch-pan-y shrink-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400';
      case 'tablet':
        return 'w-[768px] h-[calc(100vh-100px)] min-h-[520px] max-h-[880px] my-auto mx-auto shadow-2xl rounded-2xl border-4 border-slate-800 bg-white overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain touch-pan-y shrink-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400';
      case 'desktop':
      default:
        return 'w-full min-h-full';
    }
  };

  return (
    <div className="fixed inset-0 h-screen max-h-screen w-screen flex flex-col bg-slate-100 overflow-hidden select-none z-10">
      {/* Top Bar */}
      <EditorTopBar
        website={website}
        viewport={viewport}
        setViewport={setViewport}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        saving={saving}
        onSave={handleSave}
        onPublishToggle={handlePublishToggle}
        onBack={onBackToDashboard}
        onUpdateTitle={(newTitle) => setWebsite({ ...website, name: newTitle })}
      />

      {/* Main Workspace */}
      <div className="flex-1 min-h-0 w-full flex overflow-hidden relative">
        {/* Left Sidebar (Pinned / Fixed on the Left) */}
        {!previewMode && (
          <EditorLeftSidebar
            sections={website.sections || []}
            activeSectionId={activeSectionId}
            onSelectSection={handleSelectSection}
            onMoveSection={handleMoveSection}
            onDeleteSection={handleDeleteSection}
            onOpenAddSection={() => setIsAddSectionOpen(true)}
            onReorderSections={(reordered) => setWebsite({ ...website, sections: reordered })}
            theme={website.theme}
            onUpdateTheme={(theme) => setWebsite({ ...website, theme })}
            businessInfo={website.businessInfo}
            onUpdateBusinessInfo={(businessInfo) => setWebsite({ ...website, businessInfo })}
            slug={website.slug}
            onUpdateSlug={(slug) => setWebsite({ ...website, slug })}
          />
        )}

        {/* Center Canvas / Live Preview (Only this scrolls smoothly) */}
        <main
          className={`flex-1 min-h-0 h-full overflow-y-auto bg-slate-200/70 flex justify-center p-0 relative scroll-smooth ${
            viewport !== 'desktop' ? 'py-4 px-2' : ''
          }`}
        >
          {saveStatusText && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{saveStatusText}</span>
            </div>
          )}

          <div className={`transition-all duration-300 origin-top bg-white relative ${getViewportWidthClass()}`}>
            <WebsiteRenderer
              sections={website.sections || []}
              theme={website.theme}
              businessInfo={website.businessInfo}
              slug={website.slug}
              isEditor={!previewMode}
              ownerPlan={user?.plan}
              activeSectionId={activeSectionId}
              onSelectSection={handleSelectSection}
              onMoveSection={handleMoveSection}
              onDeleteSection={handleDeleteSection}
              onReorderSections={(reordered) => setWebsite({ ...website, sections: reordered })}
              onUpdateSectionContent={handleUpdateSectionContentById}
              showGridLines={showGrid}
              viewport={viewport}
            />
          </div>
        </main>

        {/* Right Sidebar Inspector (Pinned / Fixed on the Right) */}
        {!previewMode && (
          <EditorRightSidebar
            section={activeSection}
            onUpdateContent={handleUpdateActiveSectionContent}
            onClose={() => setActiveSectionId(null)}
          />
        )}
      </div>

      {/* Modal Tambah Section */}
      <AddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        onAddSection={handleAddSection}
        businessName={website.businessInfo?.name || website.name}
      />

      {/* Modal Publish Sukses */}
      {publishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Globe className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                Selamat! Landing Page Anda Sudah Terbit 🎉
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Website Anda kini aktif secara publik dan dapat langsung diakses oleh calon pelanggan tanpa perlu login.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-700 truncate text-left">
                {publicUrl}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shrink-0 flex items-center gap-1.5 transition"
              >
                {copiedLink ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPublishModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Lanjut Mengedit
              </button>
              <a
                href={`/sites/${website.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5 transition"
              >
                <span>Buka Landing Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
