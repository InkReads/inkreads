export default function FormSeparator() {
  return (
    <div className="flex items-center justify-center w-full my-4">
      <div className="flex-1 border-t border-gray-300"></div>
      <span className="px-4 text-sm text-gray-500">or</span>
      <div className="flex-1 border-t border-gray-300"></div>
    </div>
  );
}