const Impressum = () => {
  return (
    <div className="min-h-[calc(100vh-320px)] mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Impressum</h1>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3">Angaben gemäß § 5 TMG</h2>
          <p>Mehmet Bostanci</p>
          <p>Nürnberg</p>
          <p>Deutschland</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
          <span className="font-bold">E-Mail:</span> <a className="hover:underline" href="mailto:info@bostanci-art.de">info@bostanci-art.de</a>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <div className="space-y-1">
            <p>Alkan Aziz</p>
            <p>99097 Erfurt</p>
            <p>Deutschland</p>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
            <p>
              <span className="font-bold">E-Mail:</span> <a className="hover:underline" href="mailto:a.aziz@alkanaziz.com">a.aziz@alkanaziz.com</a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Haftungsausschluss</h2>
          <p className="mb-2">Haftung für Inhalte:</p>
          <p className="mb-4">Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>

          <p className="mb-2">Haftung für Links:</p>
          <p className="mb-4">Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Urheberrecht</h2>
          <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
        </section>
      </div>
    </div>
  )
}

export default Impressum