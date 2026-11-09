export const canUseWorkspace = profile => ['admin', 'super_admin', 'editor', 'publisher', 'commerce'].includes(profile?.role);
