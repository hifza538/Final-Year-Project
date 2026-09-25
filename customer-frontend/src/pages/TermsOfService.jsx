// customer-frontend/src/pages/TermsOfService.jsx

import LegalLayout, { LegalSection } from "../components/legal/LegalLayout";

const TermsOfService = () => (
  <LegalLayout title="Terms of Service" updatedDate="[insert date]">
    <LegalSection number={1} title="Introduction">
      <p>
        These Terms of Service ("Terms") govern your access to and use of LocalBites (the
        "Platform"), a food ordering and delivery application that connects Customers, Vendors
        (restaurants), and Delivery Riders. By creating an account or using the Platform, you
        agree to these Terms.
      </p>
    </LegalSection>

    <LegalSection number={2} title="Who Can Use LocalBites">
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Vendors and Delivery Riders must provide accurate identification (CNIC), contact, and,
          where applicable, vehicle information during registration, and must keep this
          information current.
        </li>
        <li>
          LocalBites reserves the right to refuse, suspend, or terminate any account that
          provides false or misleading information.
        </li>
      </ul>
    </LegalSection>

    <LegalSection number={3} title="Account Types and Approval">
      <ul className="list-disc pl-5 space-y-2">
        <li>Customers can register and use the Platform immediately after creating an account.</li>
        <li>
          Vendors and Delivery Riders must submit required documents for review. Accounts remain{" "}
          <strong>Pending</strong> until approved by a LocalBites administrator.
        </li>
        <li>
          LocalBites may reject a Vendor or Rider application, or deactivate an already-approved
          account, if the applicant does not meet our requirements or if performance falls below
          an acceptable standard (for example, a Vendor that repeatedly fails to accept orders in
          time). A reason will be provided by email when this happens.
        </li>
        <li>
          A rejected or deactivated Vendor or Rider account may be reactivated at LocalBites's
          discretion once the underlying issue is resolved.
        </li>
      </ul>
    </LegalSection>

    <LegalSection number={4} title="Orders and Payments">
      <ul className="list-disc pl-5 space-y-2">
        <li>Prices, menus, and availability are set and maintained by each Vendor.</li>
        <li>A delivery fee, shown at checkout, applies to each order in addition to the item total.</li>
        <li>
          Orders must be accepted by the Vendor within a limited time window. If a Vendor does not
          respond in time, the order is automatically cancelled and the Customer is notified.
        </li>
        <li>COD (Cash on Delivery) is available for orders, subject to Platform policies.</li>
      </ul>
    </LegalSection>

    <LegalSection number={5} title="Cancellations">
      <p>An order may be cancelled in one of the following ways:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>By the Customer, only while the order is still awaiting the Vendor's response.</li>
        <li>By the Vendor, before the order is accepted.</li>
        <li>Automatically, if the Vendor does not respond within the required time.</li>
        <li>By LocalBites, where necessary to resolve a dispute or a safety concern.</li>
      </ul>
      <p>
        Repeated vendor-caused cancellations may affect a Vendor's standing on the Platform, up to
        and including deactivation, as described in Section 3.
      </p>
    </LegalSection>

    <LegalSection number={6} title="Delivery Riders">
      <ul className="list-disc pl-5 space-y-2">
        <li>Riders must accurately report their online/offline status and only accept deliveries they can complete.</li>
        <li>Riders are responsible for handling food safely and delivering it to the address provided.</li>
        <li>Riders may be approved, warned, or deactivated in the same manner as Vendors, described in Section 3.</li>
      </ul>
    </LegalSection>

    <LegalSection number={7} title="Acceptable Use">
      <p>You agree not to:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Provide false identity, business, or vehicle information.</li>
        <li>Use the Platform for any unlawful purpose, harassment, or fraud.</li>
        <li>Interfere with the security or normal operation of the Platform.</li>
      </ul>
    </LegalSection>

    <LegalSection number={8} title="LocalBites's Role">
      <p>
        LocalBites is a technology platform that connects Customers, Vendors, and Delivery
        Riders. LocalBites does not prepare, own, or sell the food listed by Vendors, and does not
        employ Delivery Riders. LocalBites is not responsible for the quality, safety, or
        timeliness of food prepared by a Vendor, except where required by law.
      </p>
    </LegalSection>


    <LegalSection number={9} title="Account Termination">
      <p>
        LocalBites may suspend or terminate any account that violates these Terms. You may stop
        using the Platform and request account closure at any time by contacting support.
      </p>
    </LegalSection>

    <LegalSection number={10} title="Changes to These Terms">
      <p>
        LocalBites may update these Terms from time to time. Continued use of the Platform after
        changes are posted constitutes acceptance of the revised Terms.
      </p>
    </LegalSection>


    <LegalSection number={11} title="Contact Us">
      <p>
        If you have questions about these Terms, contact us at{" "}
        <a href="mailto:support@localbites.com" className="text-primary font-medium">
          support@localbites.com
        </a>
        .
      </p>
    </LegalSection>
  </LegalLayout>
);

export default TermsOfService;