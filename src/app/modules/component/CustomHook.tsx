import { useState, useRef, useCallback } from 'react';

// Custom hook sử dụng TypeScript generic để tính toán kiểu dữ liệu truyền vào
export function useTakeLatest<T extends (...args: any[]) => any>(callback: T, delay: number) {
  // Dùng useRef để lưu trữ reference đến timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dùng useCallback để đảm bảo hàm luôn nhận được cùng một tham chiếu
  const takeLatest = useCallback((...args: Parameters<T>) => {
    // Nếu timeout đã được set, clear nó để bắt đầu lại
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout mới. Thực thi callback với tham số.
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  // Cleanup function khi component unmounted hoặc khi takeLatest thay đổi
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Trả về hàm để có thể được gọi và hàm cancel để có thể clear timeout khi cần
  return [takeLatest, cancel] as const;
}
