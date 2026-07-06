"use client";

import * as React from "react";
import { Mail, Phone, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full bg-[#051424] py-section-gap px-margin-mobile md:px-margin-desktop select-none">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-stack-lg items-stretch">
        
        {/* Left Side: Info */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8">
          <div>
            <h1 className="text-display-lg-mobile md:text-display-md text-on-surface font-bold tracking-tight">
              Support Desk
            </h1>
            <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
              Have questions about prescription verifications, pharmacy bidding, or reservation pick-ups? Our support staff is ready to assist.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-container/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-body-sm text-on-surface-variant">Email Support</p>
                <p className="text-body-md font-semibold text-on-surface">support@medbids.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-container/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-body-sm text-on-surface-variant">Hotline Support</p>
                <p className="text-body-md font-semibold text-on-surface">+91 40 1234 5678</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-container/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-body-sm text-on-surface-variant">Operating Hours</p>
                <p className="text-body-md font-semibold text-on-surface">24/7 Priority Emergency Support</p>
              </div>
            </div>
          </div>

          <div className="text-body-sm text-text-muted">
            MedBids Headquarters: <br />
            Jubilee Hills, Road No. 36, Hyderabad, Telangana, India.
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="lg:col-span-7">
          <Card className="rounded-card border border-surface-card-border bg-surface-card h-full p-2">
            <CardHeader>
              <h2 className="text-headline-md font-bold text-on-surface">Submit support ticket</h2>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Fill in the details below and a client manager will get back to you shortly.
              </p>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary-container/10 border border-primary/20 flex items-center justify-center text-primary">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-headline-sm font-bold text-on-surface">Ticket Submitted</h3>
                    <p className="text-body-sm text-on-surface-variant mt-2 max-w-sm">
                      Thank you. Your request has been queued. A support member will contact you shortly on your registered number/email.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-label-md text-on-surface-variant font-medium">Full Name</label>
                      <Input placeholder="John Doe" required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-label-md text-on-surface-variant font-medium">Email Address</label>
                      <Input type="email" placeholder="john@example.com" required />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-label-md text-on-surface-variant font-medium">Topic / Subject</label>
                    <Input placeholder="Prescription verification delay, bid adjustment, etc." required />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-label-md text-on-surface-variant font-medium">Detailed Message</label>
                    <textarea
                      placeholder="Provide all relevant details here..."
                      className="w-full min-h-[140px] px-4 py-3 rounded-button bg-[#111827] border border-outline-variant text-on-surface text-body-md placeholder:text-text-muted focus:border-primary-container focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full h-12 mt-2">
                    Submit Request
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
