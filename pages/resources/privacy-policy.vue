<template>
  <div>
    <page-title>{{ title }}</page-title>
    <page-section-title>Effective Date: June 17, 2021</page-section-title>
    <p>
      The MITRE Corporation (“MITRE”) respects the privacy of its website users.
    </p>
    <p>
      This Privacy Policy explains the types of information collected by {{ mitreTitle }} from website visitors (“Users”) or that you provide to MITRE through other
      means, such as via e-mail and web forms (collectively “Site”), and how MITRE uses, shares, protects, and retains that information.
      By visiting the Site, you understand and agree to terms outlined in this Privacy Policy.
    </p>
    <h4>Information Collected from Cookies on Web Traffic Reporting and Content Tools</h4>
    <p>
      “Cookies” are data that may be sent to your web browser and stored on your computer.
      Most web browsers can be configured not to accept cookies, or to notify you if a cookie is sent to you.
      If you wish not to have cookies set during your visit to this MITRE managed Site, you can disable them in your web browser.
    </p>
    <p>
      The {{ mitreTitle }} website is hosted on GitHub®.
      This Site and GitHub use a free third-party software service called Google Analytics® that uses cookies to capture and analyze non-personally identifiable website usage information.
      For more information about collection and use of information,
      such as IP address, date and time of access, the requested URL, the referring URL (if provided by the Web browser),
      and the browser type (if provided by the Web browser) please review
      <a href="https://docs.github.com/en/github/site-policy" target="_blank">GitHub's privacy policy</a> and <a href="https://support.google.com/analytics/answer/6004245" target="_blank">Google Analytics' data practices</a>.
    </p>
    <h4>Information Collected from E-mail and Web Forms</h4>
    <p>
      Users may contact MITRE electronically, via <a href="mailto:atlas@mitre.org">atlas@mitre.org</a>.
      MITRE may share the information that you provide to us via e-mail within the corporation to respond to your queries,
      but we do not provide information to anyone outside of the corporation unless required by law to do so.
      We will never share your information with a third party for any commercial purpose.
    </p>
    <h4>Information Collected from Third Party Software and Media Sites</h4>
    <p>
      When Users visit the Site, Users may link to third party software and/or media sites when they link to another party's website.
      MITRE does not collect any information that may be collected by that third party;
      however, information you supply to that third-party software may be collected and/or used by that party.
      For information about that third party's privacy policy, please see their respective website.
    </p>
    <h4>Changes to Our Privacy Policy</h4>
    <p>
      The Site may change from time to time. As a result, at times it may be necessary for us to make changes to this Privacy Policy.
      Accordingly, MITRE reserves the right to update or modify this Privacy Policy at any time and from time to time without prior notice.
      Please review this policy periodically, and especially before you provide any information.
      Your continued use of the Site after any changes or revisions to this Privacy Policy shall indicate your agreement with the terms of such revised Privacy Policy.
    </p>
  </div>
</template>

<script>
export default {
  data: ({ $config: { name } }) => ({
    shortName: name.short,
    title: 'Privacy Policy',
    mitreTitle: name.mitre
  }),
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  }

}
</script>
