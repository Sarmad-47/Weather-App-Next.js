export default function Footer() {
  return (
    <footer className="border-t">
      <div className="flex flex-col items-center gap-1 px-4 py-4 text-xs text-muted-foreground md:px-6">
        <p>© {new Date().getFullYear()} Weather App</p>
        <p>Powered by OpenWeather API • Location via Mapbox</p>
      </div>
    </footer>
  );
}
