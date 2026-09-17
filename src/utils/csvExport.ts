import { WishlistItem, DatePlan, MemoryPhoto, QuizQuestion, CoupleProfile } from '../types';

function downloadCSV(csvContent: string, fileName: string) {
  // UTF-8 BOM so Excel opens Spanish accents correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportWishlistToCSV(wishlist: WishlistItem[]) {
  const headers = ['ID', 'Deseo', 'Categoría', 'Costo Estimado', 'Prioridad', 'Agregado Por', 'Estado', 'Fecha Cumplido', 'Notas'];
  const rows = wishlist.map(item => [
    item.id,
    `"${item.title.replace(/"/g, '""')}"`,
    item.category,
    item.estimatedCost,
    item.priority,
    `"${item.addedBy.replace(/"/g, '""')}"`,
    item.completed ? 'Cumplido' : 'Pendiente',
    item.completedDate || '',
    `"${(item.notes || '').replace(/"/g, '""')}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(csv, `duojoy_lista_deseos_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportDatesToCSV(dates: DatePlan[]) {
  const headers = ['ID', 'Cita', 'Ambiente', 'Fecha', 'Hora', 'Lugar', 'Presupuesto ($)', 'Estado', 'Calificación', 'Reseña'];
  const rows = dates.map(d => [
    d.id,
    `"${d.title.replace(/"/g, '""')}"`,
    d.vibe,
    d.date,
    d.time || '',
    `"${d.location.replace(/"/g, '""')}"`,
    d.budgetEstimated,
    d.status,
    d.rating || '',
    `"${(d.review || '').replace(/"/g, '""')}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(csv, `duojoy_planificador_citas_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportMemoriesToCSV(memories: MemoryPhoto[]) {
  const headers = ['ID', 'Título', 'Fecha', 'Ubicación', 'Etiqueta', 'Favorito', 'Me Gusta', 'Descripción'];
  const rows = memories.map(m => [
    m.id,
    `"${m.title.replace(/"/g, '""')}"`,
    m.date,
    `"${m.location.replace(/"/g, '""')}"`,
    m.tag,
    m.isFavorite ? 'Sí' : 'No',
    m.heartsCount,
    `"${m.description.replace(/"/g, '""')}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(csv, `duojoy_recuerdos_pareja_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportFullReportToCSV(
  profile: CoupleProfile,
  wishlist: WishlistItem[],
  dates: DatePlan[],
  quizzes: QuizQuestion[]
) {
  const completedWishlist = wishlist.filter(w => w.completed).length;
  const completedDates = dates.filter(d => d.status === 'completada').length;
  const totalQuizzes = quizzes.filter(q => q.partner1Answer && q.partner2Answer).length;

  const content = [
    '=== INFORME COMPLETO DE PAREJA DUOJOY ===',
    `Pareja,${profile.partner1.name} & ${profile.partner2.name}`,
    `Fecha Aniversario,${profile.anniversaryDate}`,
    `Racha de Conexión (Días),${profile.streakDays}`,
    `Nivel de Pareja,${profile.level}`,
    `Puntos de Experiencia (XP),${profile.xp}`,
    `Deseos Cumplidos,${completedWishlist} de ${wishlist.length}`,
    `Citas Realizadas,${completedDates} de ${dates.length}`,
    `Preguntas Respondidas Juntos,${totalQuizzes}`,
    `Código de Sincronización,${profile.pairCode}`,
    `Fecha del Informe,${new Date().toLocaleString()}`,
    '',
    '=== DETALLE DE LISTA DE DESEOS ===',
    'Título,Categoría,Prioridad,Estado',
    ...wishlist.map(w => `"${w.title.replace(/"/g, '""')}",${w.category},${w.priority},${w.completed ? 'Cumplido' : 'Pendiente'}`),
    '',
    '=== DETALLE DE CITAS ===',
    'Título,Fecha,Lugar,Estado,Calificación',
    ...dates.map(d => `"${d.title.replace(/"/g, '""')}",${d.date},"${d.location.replace(/"/g, '""')}",${d.status},${d.rating || '-'}`)
  ].join('\n');

  downloadCSV(content, `duojoy_informe_completo_${new Date().toISOString().slice(0, 10)}.csv`);
}
