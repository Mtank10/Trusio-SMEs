import React from 'react';
import { Invoice } from '../../types/billing';
import { Download, Eye, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface InvoiceTableProps {
  invoices: Invoice[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices }) => {
  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return CheckCircle;
      case 'open':
        return Clock;
      case 'void':
      case 'uncollectible':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'text-sustainability-600 bg-sustainability-50';
      case 'open':
        return 'text-energy-600 bg-energy-50';
      case 'void':
      case 'uncollectible':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-navy-600 bg-navy-50';
    }
  };

  const handleDownload = (invoiceId: string) => {
    // In real app, would download PDF invoice
    console.log('Downloading invoice:', invoiceId);
  };

  const handleView = (invoiceId: string) => {
    // In real app, would show invoice details
    console.log('Viewing invoice:', invoiceId);
  };

  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-navy-200 p-8 text-center">
        <div className="text-navy-400 mb-2">No invoices found</div>
        <p className="text-sm text-navy-600">Your invoices will appear here once generated</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-navy-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-navy-200">
          <thead className="bg-navy-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-navy-200">
            {invoices.map((invoice) => {
              const StatusIcon = getStatusIcon(invoice.status);
              return (
                <tr key={invoice.id} className="hover:bg-navy-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-navy-800">
                        #{invoice.id.slice(0, 8)}
                      </div>
                      <div className="text-sm text-navy-600">
                        {invoice.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-navy-800">
                      ${invoice.amount.toFixed(2)} {invoice.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="capitalize">{invoice.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-600">
                    {invoice.dueDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(invoice.id)}
                        className="text-trust-600 hover:text-trust-700 p-1 rounded"
                        title="View Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(invoice.id)}
                        className="text-energy-600 hover:text-energy-700 p-1 rounded"
                        title="Download Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;