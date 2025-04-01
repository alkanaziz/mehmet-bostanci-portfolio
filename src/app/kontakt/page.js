"use client";

import { useState } from "react";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";

const Kontakt = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="px-4 py-8 sm:px-10 lg:px-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-serif text-3xl font-bold">Kontakt</h1>
        <p className="mx-auto text-gray-600">
          Haben Sie Fragen oder möchten Sie mehr über meine Kunst erfahren? Ich
          freue mich auf Ihre Nachricht.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Contact Information */}
        <div className="space-y-8 rounded-lg bg-gray-50">
          <div className="m-4 space-y-6">
            <h2 className="text-center font-serif text-xl font-semibold">
              Kontaktinformationen
            </h2>

            <div className="flex items-start space-x-4">
              <MdEmail className="mt-1 size-6 text-gray-600" />
              <div>
                <p className="font-medium">Email</p>
                <a
                  href="mailto:info@bostanci-art.de"
                  className="text-black-600 hover:underline"
                >
                  info@bostanci-art.de
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MdLocationOn className="mt-1 size-6 text-gray-600" />
              <div>
                <p className="font-medium">Adresse</p>
                <p>Nürnberg, Deutschland</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaInstagram className="mt-1 size-6 text-gray-600" />
              <div>
                <p className="font-medium">Social Media</p>
                <div className="flex flex-col justify-center">
                  <Link
                    href="https://www.instagram.com/aquarelllkunst/"
                    target="_blank"
                    className="group flex max-w-max items-center gap-2 hover:underline"
                  >
                    <FaInstagram className="transform text-xl transition-transform duration-300 group-hover:translate-x-1" />
                    @aqueralllkunst
                  </Link>
                  <Link
                    href="https://www.instagram.com/grafikermehmet/"
                    target="_blank"
                    className="group flex max-w-max items-center gap-2 hover:underline"
                  >
                    <FaInstagram className="transform text-xl transition-transform duration-300 group-hover:translate-x-1" />
                    @grafikermehmet
                  </Link>
                  <Link
                    href="https://www.instagram.com/ebrulikunst/"
                    target="_blank"
                    className="group flex max-w-max items-center gap-2 hover:underline"
                  >
                    <FaInstagram className="transform text-xl transition-transform duration-300 group-hover:translate-x-1" />
                    @ebrulikunst
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        {/* <div className="rounded-lg bg-white p-4 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-center font-serif text-xl font-semibold">
              Kontaktformular
            </h2>
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Betreff
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Nachricht
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              ></textarea>
            </div>

            <button
              type="submit"
              className="hover:bg-black-700 w-full rounded-md bg-black px-4 py-2 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Nachricht senden
            </button>
          </form>
        </div> */}
      </div>
    </div>
  );
};

export default Kontakt;
