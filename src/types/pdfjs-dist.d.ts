declare module 'pdfjs-dist' {
	export * from 'pdfjs-dist/types/src/pdf'
	export const GlobalWorkerOptions: {
		workerSrc: string
	}
	export function getDocument(data: Uint8Array | ArrayBuffer): any
}
