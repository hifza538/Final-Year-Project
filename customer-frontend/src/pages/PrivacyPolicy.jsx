// customer-frontend/src/pages/PrivacyPolicy.jsx

import LegalLayout, { LegalSection } from "../components/legal/LegalLayout";


const PrivacyPolicy = () => (
  <LegalLayout title="Privacy Policy" updatedDate="[insert date]">
    <LegalSection number={1} title="Introduction">
      <p>
        This Privacy Policy explains what information LocalBites ("we", "us") collects from
        Customers, Vendors, Delivery Riders, and Admins, how it is used, and how it is protected.
      </p>
    </LegalSection>

    <LegalSection number={2} title="Information We Collect">
      <p className="font-medium text-secondary">Provided by you</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>All users:</strong> full name, email address, phone number, and password
          (stored as a secure hash, never in plain text).
        </li>
        <li>
          <strong>Customers:</strong> delivery addresses and, if you allow it, your device
          location, to show restaurants that can deliver to you.
        </li>
        <li>
          <strong>Vendors:</strong> restaurant name, address, cuisine type, business hours, CNIC
          number and CNIC images, and licence details where provided.
        </li>
        <li>
          <strong>Delivery Riders:</strong> CNIC number and CNIC images, vehicle type and vehicle
          number.
        </li>
      </ul>

      <p className="font-medium text-secondary pt-2">Collected automatically</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Order history, order status, and cancellation records.</li>
        <li>Online/offline status and, during a delivery, delivery stage updates (for Riders).</li>
        <li>Basic technical information such as login timestamps, used to keep your account secure.</li>
      </ul>
    </LegalSection>

    <LegalSection number={3} title="How We Use Your Information">
      <ul className="list-disc pl-5 space-y-2">
        <li>To create and manage your account, including the Vendor/Rider approval process.</li>
        <li>To process and deliver orders, connecting Customers, Vendors, and Riders as needed.</li>
        <li>
          To send account-related emails, including approval, rejection, and performance-related
          notifications.
        </li>
        <li>To verify identity documents (CNIC) submitted by Vendors and Riders during registration.</li>
        <li>To maintain the safety and integrity of the Platform.</li>
      </ul>
    </LegalSection>

    <LegalSection number={4} title="Who Can See Your Information">
      <ul className="list-disc pl-5 space-y-2">
        <li>A Vendor sees the name, phone number, and delivery address of a Customer who places an order with them, only to fulfil that order.</li>
        <li>A Delivery Rider, once assigned to an order, sees the Customer's name, phone number, and delivery address.</li>
        <li>LocalBites administrators can view Vendor and Rider identity documents for verification, and order records for support.</li>
      </ul>
      <p>We do not sell your personal information to third parties.</p>
    </LegalSection>

    <LegalSection number={5} title="Third-Party Services">
      <p>LocalBites uses the following third-party services to operate the Platform:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Cloudinary</strong>, to store uploaded images (CNIC documents, restaurant photos, menu item photos, category images).</li>
        <li>An <strong>email service provider</strong>, to send account, order, and performance-related notifications.</li>
      </ul>
      <p>These providers only receive the information necessary to perform their function.</p>
    </LegalSection>

    <LegalSection number={6} title="Data Storage and Security">
      <ul className="list-disc pl-5 space-y-2">
        <li>Passwords are hashed before being stored and are never stored or transmitted in plain text.</li>
        <li>Access to the Platform is controlled using secure, time-limited login tokens.</li>
        <li>Identity documents are stored securely and are only accessible to authorised administrators.</li>
      </ul>
    </LegalSection>

    <LegalSection number={7} title="Data Retention">
      <p>
        We retain account and order information for as long as your account is active, and for a
        reasonable period afterward as required for record-keeping or legal compliance.
      </p>
    </LegalSection>

    <LegalSection number={8} title="Your Rights">
      <p>You may request a copy of your information, request a correction, or request deletion of your account, subject to any records we are required to keep by law.</p>
    </LegalSection>


    <LegalSection number={10} title="Contact Us">
      <p>
        If you have questions about this Privacy Policy, contact us at{" "}
        <a href="mailto:support@localbites.com" className="text-primary font-medium">
          support@localbites.com
        </a>
        .
      </p>
    </LegalSection>

    <LegalSection number={11} title="Changes to This Policy">
      <p>We may update this Privacy Policy from time to time.</p>
    </LegalSection>
  </LegalLayout>
);

export default PrivacyPolicy;