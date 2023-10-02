'use client';
import { Fragment, useState, FormEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { addUserEmailToProduct } from '@/lib/actions';

interface Props {
  productId: string;
}

const Modal = ({ productId }: Props) => {
  let [isOpen, setIsOpen] = useState(false);
  const [isSubmittimg, setIsSubmittimg] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittimg(true);

    await addUserEmailToProduct(productId, email);
    setIsSubmittimg(false);
    setEmail('');
    closeModal();
  };
  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button type='button' className='btn' onClick={openModal}>
        Track
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog as='div' onClose={closeModal} className={'dialog-container'}>
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
              <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className='inline-block h-screen align-middle'
              aria-hidden='true'>
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'>
              <div className='dialog-content'>
                <div className='flex flex-col'>
                  <div className='flex justify-between'>
                    <div className='p-3 border border-gray-200 rounded-10'>
                      <Image
                        src={'/assets/icons/logo.svg'}
                        alt='logo'
                        width={28}
                        height={28}
                      />
                    </div>

                    <Image
                      src={'/assets/icons/x-close.svg'}
                      alt='close'
                      width={24}
                      height={24}
                      onClick={closeModal}
                      className='cursor-pointer'
                      // style={{ width: '24px', height: '24px' }}
                    />
                  </div>
                  <h4 className='dialog-head_text'>
                    Stay updated with product pricing alerts right in your
                    inbox!
                  </h4>
                  <p className='text-sm text-gray-600 mt-2'>
                    Never miss a bargain again with our timely alerts!
                  </p>
                </div>

                {/* email */}
                <form onSubmit={handleSubmit} className='flex flex-col mt-5'>
                  <label
                    htmlFor='email'
                    className='text-sm font-medium text-gray-700'>
                    Email Address
                  </label>
                  <div className='dialog-input_container'>
                    <Image
                      src={'/assets/icons/mail.svg'}
                      alt='mail'
                      width={18}
                      height={18}
                    />
                    <input
                      required
                      type='email'
                      name='email'
                      id='email'
                      value={email}
                      autoComplete='email'
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='Enter your email address'
                      className='dialog-input'
                    />
                  </div>
                  <button type='submit' className='dialog-btn'>
                    {isSubmittimg ? 'Submitting...' : 'Track'}
                  </button>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
