import * as XLSX from 'xlsx';

export interface Student {
  id: number;
  email: string;
  username: string;
  isActive: boolean;
  createdAt: string;
}

export function exportStudentsToXLSX(students: Student[]): void {
  const worksheet = XLSX.utils.json_to_sheet(
    students.map(({ id, email, username, isActive, createdAt }) => ({
      ID: id,
      Username: username,
      Email: email,
      Status: isActive ? 'Active' : 'Inactive',
      'Registered At': new Date(createdAt).toLocaleString(),
    }))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  XLSX.writeFile(workbook, 'students.xlsx');
}
