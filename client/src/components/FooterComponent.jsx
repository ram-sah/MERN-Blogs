import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsLinkedin } from "react-icons/bs";
const FooterComponent = () => {
  return (
    <Footer container className="border border-t-4 border-blue-200">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold "
            >
              <span className="px-3 py-2 bg-gradient-to-r from-blue-500 via-purple-400 to-blue-400 rounded-lg text-white">
                Ram's
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-8 sm:grid-cols-3 sm:gap-5">
            <div>
              <Footer.Title title="ABOUT" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GetHub
                </Footer.Link>
                <Footer.Link href="/about" rel="noopener noreferrer">
                  Ram's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="FOLLOWS US" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Linkedin
                </Footer.Link>
                <Footer.Link
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="LEGAL" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Term's & Conditions</Footer.Link>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between ">
          <Footer.Copyright
            href="#"
            by="Ram's blog"
            year={new Date().getFullYear()}
          />
          <div className=" flex gap-5 mt-5 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} className="text-blue-500" />
            <Footer.Icon href="#" icon={BsInstagram} className="text-red-500"/>
            <Footer.Icon href="#" icon={BsLinkedin} className="text-blue-500" />
            <Footer.Icon href="#" icon={BsTwitter} className="text-blue-400" />
            <Footer.Icon href="#" icon={BsGithub} className="text-black-300" />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
